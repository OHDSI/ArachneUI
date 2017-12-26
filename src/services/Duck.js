/*
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
 * Created: July 19, 2017
 *
 */

import { get } from 'services/Utils';
import ActionFactory from './ActionFactory';
import ReducerFactory from './ReducerFactory';
import { action as actionName } from './CrudActionNameBuilder';

class Duck {
  constructor({ name, urlBuilder }) {
    this.actions = this.buildActionCreators({ name, urlBuilder });
    this.reducer = this.buildReducer({ name });
  }

  buildActionCreators({ name, urlBuilder }) {
    const actionFactory = new ActionFactory();
    actionFactory.urlBuilder = urlBuilder;
    actionFactory.initCrud({ name });
    return {
      query: actionFactory.buildLoad(),
      find: actionFactory.buildFind(),
      create: actionFactory.buildCreateActionCreator(),
      update: actionFactory.buildUpdateActionCreator(),
      delete: actionFactory.buildDeleteActionCreator(),
    }
  }

  buildReducer({ name }) {
    return new ReducerFactory()
      // GET_PENDING
      .setActionHandler(
        actionName(name).query().pending().toString(),
        (state, action) => ({
          ...state,
          isLoading: true,
          requestParams: action.payload || null,
        })
      )
      // GET_FULFILLED
      .setActionHandler(
        actionName(name).query().done().toString(),
        (state, action) => ({
          ...state,
          isLoading: false,
          queryResult: get(action.payload, 'result'),
          requestParams: get(action.payload, 'requestParams'),
        })
      )
      // FIND_PENDING
      .setActionHandler(
        actionName(name).find().pending().toString(),
        (state, action) => ({
          ...state,
          isLoading: true,
        })
      )
      // FIND_FULFILLED
      .setActionHandler(
        actionName(name).find().done().toString(),
        (state, action) => ({
          ...state,
          isLoading: false,
          data: action.payload,
        })
      )
      // CREATE_PENDING
      .setActionHandler(
        actionName(name).create().pending().toString(),
        (state, action) => ({
          ...state,
          isSaving: true,
        })
      )
      // CREATE_FULFILLED
      .setActionHandler(
        actionName(name).create().done().toString(),
        (state, action) => ({
          ...state,
          isSaving: false,
          data: null,
        })
      )
      // UPDATE_PENDING
      .setActionHandler(
        actionName(name).update().pending().toString(),
        (state, action) => ({
          ...state,
          isUpdating: true,
        })
      )
      // UPDATE_FULFILLED
      .setActionHandler(
        actionName(name).update().done().toString(),
        (state, action) => ({
          ...state,
          isUpdating: false,
        })
      )
      // DELETE_PENDING
      .setActionHandler(
        actionName(name).delete().pending().toString(),
        (state, action) => ({
          ...state,
          isDeleting: true,
          data: null,
        })
      )
      // DELETE_FULFILLED
      .setActionHandler(
        actionName(name).delete().done().toString(),
        (state, action) => ({
          ...state,
          isDeleting: false,
          data: null,
        })
      )
      .build();
  }
}

export default Duck;
