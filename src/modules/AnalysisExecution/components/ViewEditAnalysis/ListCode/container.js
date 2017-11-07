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
 * Created: December 13, 2016
 *
 */

// @ts-check
import get from 'lodash/get';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions/index';
import { apiPaths, modal } from 'modules/AnalysisExecution/const';
import { Utils } from 'services/Utils';
import SelectorsBuilder from './selectors';

import ListCode from './presenter';

const selectors = (new SelectorsBuilder()).build();

/** @augments{ Component<any, any>} */
export default class ListCodeBuilder {
  getComponent() {
    return ListCode;
  }

  mapStateToProps(state) {
    const analysisData = get(state, 'analysisExecution.analysis.data.result');
    const analysisId = get(analysisData, 'id');
    const codeList = selectors.getCodeList(state);
    const downloadAllLink = apiPaths.analysisCodeDownloadAll({ analysisId });
    const isSubmittable = get(analysisData, 'permissions.CREATE_SUBMISSION', false);
    const isLocked = get(analysisData, 'locked');
    const isLoading = selectors.getIsLoading(state);
    const canDeleteFiles = get(analysisData, 'permissions.DELETE_ANALYSIS_FILES', false);
    const canSubmit = codeList.length > 0;

    return {
      analysisId,
      codeList,
      downloadAllLink,
      isSubmittable,
      isLocked,
      isLoading,
      canDeleteFiles,
      canSubmit,
    };
  }

  getMapDispatchToProps() {
    return {
      openCreateCodeModal: ModalUtils.actions.toggle.bind(null, modal.createCode, true),
      openSubmitModal: ModalUtils.actions.toggle.bind(null, modal.submitCode, true),
      loadAnalysis: actions.analysisExecution.analysis.find,
      removeCode: actions.analysisExecution.code.delete,
      reimportCode: actions.analysisExecution.importEntity.reimport,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      reimportCode(analysisCodeId) {
        dispatchProps
          .reimportCode({ analysisId: stateProps.analysisId, fileId: analysisCodeId })
          .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));
      },
      removeCode(analysisCodeId) {
        Utils.confirmDelete({
          message: 'Are you sure want to delete this file?',
        })
          .then(() => {
            dispatchProps
              .removeCode({ analysisId: stateProps.analysisId, analysisCodeId })
              .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));
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
