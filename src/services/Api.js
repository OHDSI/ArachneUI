// @ts-check

/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 28, 2016
 *
 */

import { Api } from '@ohdsi/ui-toolbox';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs/lib/stomp';
import { Notifier } from 'services/Notifier';

class ArachneApi extends Api {
  getUserRequested() {
  }

  setUserRequestedGetter(getUserRequested) {
    this.getUserRequested = getUserRequested;
    return this;
  }

  handleUnexpectedError() {
    Notifier.alert({ message: 'Oooops!.. Something went wrong :(' });
  }

  getHeaders() {
    const headers = super.getHeaders();

    const requested = this.getUserRequested();
    if (requested) {
      headers['Arachne-User-Request'] = requested;
    }

    return headers;
  }

  // Websockets

  initWS() {
    if (!this.initWsPromise) {
      this.initWsPromise = new Promise((resolve) => {
        this.socket = new SockJS('/arachne-websocket');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect(
          this.getHeaders(),
          () => {
            this.isWsInited = true;
            resolve();
          }
        );
      });
    }
    return this.initWsPromise;
  }

  doWsAction(func) {
    let resPromise;
    if (this.isWsInited) {
      resPromise = new Promise((resolve) => {
        resolve(func.call(this));
      });
    } else {
      resPromise = this.initWS().then(() => func.call(this));
    }
    return resPromise;
  }

  subscribe(url, cb) {
    return this.doWsAction(() => this.stompClient.subscribe(url, cb, this.getHeaders()));
  }

  unsubscribe(id) {
    this.doWsAction(() => {
      this.stompClient.unsubscribe(id);
    });
  }

}

const singletonApi = new ArachneApi();

export default singletonApi;
