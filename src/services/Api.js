// @ts-check

/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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

import URI from 'urijs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs/lib/stomp';
import { Notifier } from 'services/Notifier';

const STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
};
const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
const AUTH_TOKEN_HEADER = 'Arachne-Auth-Token';
const JSON_RESPONSE_TYPE = 'application/json';

const HEADERS = {
  Accept: JSON_RESPONSE_TYPE,
};

class Api {

  constructor() {
    this.apiHost = '';
  }

  setApiHost(url) {
    this.apiHost = url;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserToken() {
    console.error('Replace this interface with implementation');
  }

  getUserRequested() {
  }

  setUserTokenGetter(getUserToken) {
    this.getUserToken = getUserToken;
    return this;
  }

  setUserRequestedGetter(getUserRequested) {
    this.getUserRequested = getUserRequested;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  handleUnauthorized() {
    console.error('Replace this interface with implementation');
  }

  setUnauthorizedHandler(handler) {
    this.handleUnauthorized = handler;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  handleUnexpectedError() {
    Notifier.alert({ message: 'Oooops!.. Something went wrong :(' });
  }

  getHeaders() {
    const headers = { ...HEADERS };
    const token = this.getUserToken();

    if (token) {
      headers[AUTH_TOKEN_HEADER] = token;
    }

    const requested = this.getUserRequested();
    if (requested) {
      headers['Arachne-User-Request'] = requested;
    }

    return headers;
  }

  /**
   * Checks HTTP status for errors.
   * @param  { {[x: string]: any} } response
   * @return {boolean}
   */
  checkStatusError(response) {
    const status = response.status;

    switch (status) {
      case STATUS.OK:
        return true;
      case STATUS.UNAUTHORIZED:
        this.handleUnauthorized(response.json);
        break;
      default:
        this.handleUnexpectedError();
        break;
    }

    return false;
  }

  sendRequest(method, path, payload, callback) {
    const params = {
      method,
      headers: this.getHeaders(),
    };

    if (payload && payload instanceof FormData) {
      params.body = payload;
      // NOTE:
      // Do not set 'Content-Type' - browser will automatically do this.
      // Problem is in a 'boundary'.
      // http://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    } else if (payload) {
      params.body = JSON.stringify(payload);
      params.headers['Content-Type'] = JSON_RESPONSE_TYPE;
    }

    /*
    // Superagent

    const req = request(method, path);

    return req
      .set(params.headers)
      .send(payload)
      .then((error, res) => {
        if (this.checkStatusError(res)) {
          if (typeof callback === 'function') {
            callback(res.body);
          }
        }
        return res.body;
      });*/

    const fullpath = this.apiHost + path;
    return fetch(fullpath, params)
      .then(res => {
        return res.text()
          // Protection from empty response
          .then(text => text ? JSON.parse(text) : {})
          .then(json => ({ ok: res.ok, status: res.status, json }))
      })
      .then((res) => {
        if (this.checkStatusError(res)) {
          if (typeof callback === 'function') {
            callback(res.json);
          }
        }
        return res.json;
      });
  }

  doGet(path, payload, callback) {
    // Path with attached GET params
    let pathWithParams;
    // Callback, taking in account function overloads
    let resolvedCb;

    if (typeof payload === 'function') {
      // If used function overload: doGet(path, callback)
      pathWithParams = path;
      resolvedCb = payload;
    } else {
      // If used full-version, with passed GET params
      const uri = new URI(path);
      uri.setSearch(payload);

      pathWithParams = uri.toString();
      resolvedCb = callback;
    }

    return this.sendRequest(METHODS.GET, pathWithParams, null, resolvedCb);
  }

  doPost(path, payload, callback) {
    return this.sendRequest(METHODS.POST, path, payload, callback);
  }

  doPut(path, payload, callback) {
    return this.sendRequest(METHODS.PUT, path, payload, callback);
  }

  doDelete(path, payload, callback) {
    return this.sendRequest(METHODS.DELETE, path, payload, callback);
  }

  async doFileDownload(path, callback) {
    try {
      const request = fetch(path, {
        headers: {
          [AUTH_TOKEN_HEADER]: this.getUserToken(),
        }
      });
      const response = await request;
      const blob = await response.blob();
      callback(blob);
    } catch (err) {
      throw new Error(err);
    }
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

const singletonApi = new Api();

export default singletonApi;
