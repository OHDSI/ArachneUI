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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions/index';
import { apiPaths, modal, analysisPermissions } from 'modules/AnalysisExecution/const';
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
        const analysisType = get(analysisData, 'type.id');
        const codeList = selectors.getCodeList(state);
        const downloadAllLink = apiPaths.analysisCodeDownloadAll({analysisId});
        const isLocked = get(analysisData, 'locked');

        const permissions = get(analysisData, 'permissions', {});
        const isSubmittable = get(permissions, analysisPermissions.createSubmission, false);
        const canAddFiles = get(permissions, analysisPermissions.uploadAnalysisFiles, false);

        const canSubmit = codeList.length > 0;
        const isLoading = selectors.getIsLoading(state);

        return {
            analysisId,
            analysisType,
            codeList,
            downloadAllLink,
            isSubmittable,
            isLocked,
            isLoading,
            canSubmit,
            canAddFiles,
            isExecutableSelected: codeList.find(file => file.isExecutable),
        };
    }

    getMapDispatchToProps() {
        return {
            openCreateCodeModal: activeSection => ModalUtils.actions.toggle(modal.createCode, true, {activeSection}),
            openUpdateDescriptionModal: newDescription => ModalUtils.actions.toggle(modal.updateAnalysisDescription, true, {newDescription}),
            openSubmitModal: ModalUtils.actions.toggle.bind(null, modal.submitCode, true),
            loadAnalysis: actions.analysisExecution.analysis.find,
            removeCode: actions.analysisExecution.code.delete,
            reimportCode: actions.analysisExecution.importEntity.update,
        };
    }

    mergeProps(stateProps, dispatchProps, ownProps) {
        return {
            ...ownProps,
            ...stateProps,
            ...dispatchProps,
            async reimportCode(analysisCodeId) {

                const reimportResult = await dispatchProps
                    .reimportCode({
                        analysisId: stateProps.analysisId,
                        fileId: analysisCodeId,
                        type: stateProps.analysisType,
                    });

                const newDescription = reimportResult.result;
                if (!!newDescription) {
                    await dispatchProps.openUpdateDescriptionModal(newDescription);
                }
                await dispatchProps.loadAnalysis({id: stateProps.analysisId});
            },
            async removeCode(analysisCodeId) {
                await Utils.confirmDelete({
                    message: 'Are you sure you want to delete this file?',
                });

                await dispatchProps.removeCode({analysisId: stateProps.analysisId, analysisCodeId});
                await dispatchProps.loadAnalysis({id: stateProps.analysisId});
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
