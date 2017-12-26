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
 * Authors: Pavel Grafkin
 * Created: December 25, 2017
 *
 */

import Duck from 'services/Duck';
import { get } from 'services/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { apiPaths, fileTypes } from 'modules/AnalysisExecution/const';
import ReducerFactory from 'services/ReducerFactory';
import { action as actionName } from 'services/CrudActionNameBuilder';
import FileTreeUtils from 'services/FileTreeUtils';

const coreName = 'AE_FILE_VIEWER_TREE';

class FileTreeDataDuckBuilder {
  constructor() {
    this.reducerFactory = new ReducerFactory();

    this.actions = {
      QUERY: actionName(coreName).query().pending().toString(),
      QUERY_FULLFILLED: actionName(coreName).query().done().toString(),
      FLUSH: `${coreName}_FLUSH`,
      TOGGLE: `${coreName}_TOGGLE`,
      SELECT_FILE: `${coreName}_SELECT_FILE`,
    };

    this.duck = new Duck({
      name: coreName,
      urlBuilder: this.urlBuilder,
    });
  }

  urlBuilder({ type, entityId }) {
    if (type === fileTypes.SUBMISSION_RESULT) {
      return apiPaths.submissionCodeFiles({ submissionId: entityId });
    }
    return null;
  }

  getToggleAction() {
    return ({ relativePath }, state) => ({
      type: this.actions.TOGGLE,
      payload: {
        relativePath,
        state,
      },
    });
  }

  getSelectFileAction() {
    return ({ relativePath }) => ({
      type: this.actions.SELECT_FILE,
      payload: {
        relativePath,
      },
    });
  }

  getFlushAction() {
    return () => ({
      type: this.actions.FLUSH,
      payload: {},
    });
  }

  buildReducer() {
    return this.reducerFactory
      .setActionHandlers([
        {
          action: this.actions.QUERY,
          handler: (state, { payload: requestParams }) => {
            const treeInProgress = FileTreeUtils.getTreeWithUpdatedNodeProps(
              state.queryResult,
              get(requestParams, 'query.path'),
              {
                isLoading: true,
                children: [],
              }
            );

            return {
              ...state,
              isLoading: true,
              requestParams,
              queryResult: treeInProgress,
            };
          },
        },
        {
          action: this.actions.QUERY_FULLFILLED,
          handler: (state, { payload: { requestParams, result } }) => {
            const treeLoaded = FileTreeUtils.getTreeWithUpdatedNodeProps(
              state.queryResult,
              get(requestParams, 'query.path'),
              {
                isLoading: false,
                children: result,
                loaded: true,
              }
            );
            return {
              ...state,
              isLoading: false,
              queryResult: treeLoaded,
            };
          },
        },
        {
          action: this.actions.TOGGLE,
          handler: (state, { payload: { relativePath, state: nodeState, toggleParents = false } }) => {
            const newTree = cloneDeep(state.queryResult);
            const toggleRelPath = relativePath;
            const toggledNode = FileTreeUtils.findNodeByPath(newTree, toggleRelPath, toggleParents);
            const toggledNodeList = Array.isArray(toggledNode) ? toggledNode : [toggledNode];
            toggledNodeList.forEach(
              (node) => { node.isExpanded = nodeState; }
            );
            return {
              ...state,
              queryResult: newTree,
            };
          },
        },
        {
          action: this.actions.SELECT_FILE,
          handler: (state, { payload: { relativePath } }) => {
            return {
              ...state,
              selectedFile: relativePath,
            };
          },
        },
        {
          action: this.actions.FLUSH,
          handler: (state, action) => {
            if (state.selectedFile || state.queryResult || state.requestParams) {
              const { selectedFile, queryResult, requestParams, ...rest } = state;
              return rest;
            } else {
              return state;
            }
          },
        },
      ])
      .build();
  }

  build() {
    return {
      actions: {
        query: this.duck.actions.query,
        toggle: this.getToggleAction(),
        selectFile: this.getSelectFileAction(),
        flush: this.getFlushAction(),
      },
      reducer: this.buildReducer(),
    };
  }
}

const builder = new FileTreeDataDuckBuilder();

export default builder.build();
