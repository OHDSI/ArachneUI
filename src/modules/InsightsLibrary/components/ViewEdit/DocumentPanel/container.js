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
 * Created: July 25, 2017
 *
 */

// @ts-check
import { Utils, get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions';
import { modals } from 'modules/InsightsLibrary/const';
import DocumentPanel from './presenter';

/** @augments { Component<any, any> } */
export default class DocumentPanelBuilder {
  getComponent() {
    return DocumentPanel;
  }

  mapStateToProps(state) {
    return {
      insightId: get(state, 'insightsLibrary.insights.data.id', -1),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openModal: (modal, isOpened, data) => ModalUtils.actions.toggle(modal, isOpened, data),
      loadInsight: actions.insightsLibrary.insights.find,
      deleteFile: actions.insightsLibrary.insightFiles.delete,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      openModal: () => {
        return dispatchProps.openModal(modals.insightFile, true, { type: ownProps.type });
      },
      deleteFile: (file) => {
        Utils.confirmDelete({
          message: 'Are you sure want to delete this file?',
        })
          .then(() => {
            dispatchProps
              .deleteFile({
                insightId: stateProps.insightId,
                fileUuid: file.uuid,
                query: {
                  type: file.type,
                },
              })
              .then(() => dispatchProps.loadInsight({ insightId: stateProps.insightId }));
          });
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}
