/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: May 11, 2017
 *
 */

import URI from 'urijs';
import get from 'lodash/get';
import api from 'services/Api';
import { validators } from 'services/Utils';
import { action } from './CrudActionNameBuilder';

class ActionFactory {

  constructor(args) {
    if (args && args.urlBuilder && args.receiveActionType) {
      this.initLegacy(args);
    }
  }

  initLegacy({
    requestActionType,
    receiveActionType,
    updatedActionType,
    urlBuilder,
  }) {
    this.urlBuilder = urlBuilder;
    this.onBeforeLoad = this.onBeforeUpdate = this.onBeforeDelete = this.buildActionCreator(requestActionType);
    this.onAfterLoad = this.buildActionCreator(receiveActionType);
    this.onAfterUpdate = this.onAfterDelete = this.buildActionCreator(updatedActionType);
  }

  initCrud({ name }) {
    this.onBeforeLoad = this.buildActionCreator(action(name).query().pending().toString());
    this.onAfterLoad = this.buildActionCreator(action(name).query().done().toString());

    this.onBeforeFind = this.buildActionCreator(action(name).find().pending().toString());
    this.onAfterFind = this.buildActionCreator(action(name).find().done().toString());

    this.onBeforeCreate = this.buildActionCreator(action(name).create().pending().toString());
    this.onAfterCreate = this.buildActionCreator(action(name).create().done().toString());

    this.onBeforeUpdate = this.buildActionCreator(action(name).update().pending().toString());
    this.onAfterUpdate = this.buildActionCreator(action(name).update().done().toString());

    this.onBeforeDelete = this.buildActionCreator(action(name).delete().pending().toString());
    this.onAfterDelete = this.buildActionCreator(action(name).delete().done().toString());
  }

  /**
   * Utils
   */

  buildActionCreator(type) {
    return (payload) => {
      const action = { type };
      if (payload) {
        action.payload = payload;
      }
      return action;
    }
  }

  resolveUrl(urlParams, getParams) {
    let path = urlParams ? this.urlBuilder(urlParams) : this.urlBuilder();

    if (getParams) {
      const uri = new URI(path);
      uri.setSearch(getParams);
      path = uri.toString();
    }

    return path;
  }

  safeDispatch(dispatch, actionCreator, data) {
    const action = actionCreator(data);
    if (action && action.type) {
      dispatch(action);
    }
  }

  /**
   * GET
   */
 
  onBeforeLoad(data) {}
  onAfterLoad(data) {}

  // Legacy. For JsonResult
  buildLoadActionCreator({ resultDataPath = 'result' } = {}) {
    return (urlParams, getParams) => (dispatch) => {
      this.safeDispatch(
        dispatch,
        this.onBeforeLoad,
        { url: urlParams, query: getParams }
      );
      return api.doGet(
        this.resolveUrl(urlParams, getParams),
        (res) => {
          const result = resultDataPath ? get(res, resultDataPath) : res;
          this.safeDispatch(
            dispatch,
            this.onAfterLoad,
            result
          );
        }
      );
    };
  }

  buildLoad({ resultDataPath = null } = {}) {
    return this.buildLoadActionCreator({ resultDataPath });
  }

  /**
   * FIND
   */
 
  onBeforeFind(data) {}
  onAfterFind(data) {}

  buildFind({ resultDataPath = '' } = {}) {
    return (urlParams) => (dispatch) => {
      this.safeDispatch(dispatch, this.onBeforeFind);
      return api.doGet(
        this.resolveUrl(urlParams),
        (res) => {
          const result = resultDataPath ? get(res, resultDataPath) : res;
          this.safeDispatch(
            dispatch,
            this.onAfterFind,
            result
          );
        }
      );
    };
  }
  
  /**
   * CREATE
   */
 
  onBeforeCreate(data) {}
  onAfterCreate(data) {}

  buildCreateActionCreator() {
    return (urlParams, data) => (dispatch) => {
      this.safeDispatch(dispatch, this.onBeforeCreate);
      return api.doPost(
        this.resolveUrl(urlParams),
        data,
        res => {
          validators.checkValidationError(res);
          this.safeDispatch(
            dispatch,
            this.onAfterCreate,
            res
          );
        }
      );
    }
  }

  /**
   * UPDATE
   */
 
  onBeforeUpdate(data) {}
  onAfterUpdate(data) {}

  buildUpdateActionCreator() {
    return (urlParams, data) => (dispatch) => {
      this.safeDispatch(dispatch, this.onBeforeUpdate);
      return api.doPut(
        this.resolveUrl(urlParams),
        data,
        (res) => {
          validators.checkValidationError(res);
          this.safeDispatch(dispatch, this.onAfterUpdate);
        }
      );
    };
  }

  /**
   * DELETE
   */
 
  onBeforeDelete(data) {}
  onAfterDelete(data) {}

  buildDeleteActionCreator() {
    return urlParams => (dispatch) => {
      this.safeDispatch(dispatch, this.onBeforeDelete);
      return api.doDelete(
        this.resolveUrl(urlParams),
        () => {
          this.safeDispatch(dispatch, this.onAfterDelete);
        }
      );
    };
  }

}

export default ActionFactory;
