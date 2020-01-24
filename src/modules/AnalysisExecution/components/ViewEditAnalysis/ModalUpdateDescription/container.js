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
 * Authors: Alexandr Cumarav
 * Created: January 22, 2020
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { get } from 'services/Utils';
import actions from 'actions/index';
import { ModalUtils } from "arachne-ui-components";
import { form, modal } from 'modules/AnalysisExecution/const';
import ModalUpdateDescription from './presenter';

function mapStateToProps(state) {

    const modalState = state.modal.updateAnalysisDescription;
    const newDescription = get(modalState, 'data.newDescription', '');
    const analysisData = get(state, 'analysisExecution.analysis.data.result');
    return {
        analysisId: get(analysisData, 'id'),
        typeId: get(analysisData, 'type.id'),
        initialValues: {
            description: get(analysisData, 'description'),
        },
        newDescription,
    };
}

const mapDispatchToProps = {
    updateAnalysis: actions.analysisExecution.analysis.update,
    loadAnalysis: actions.analysisExecution.analysis.find,
    closeModal: () => ModalUtils.actions.toggle(modal.updateAnalysisDescription, false),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        async doSubmit() {

            await dispatchProps.updateAnalysis(
                {id: stateProps.analysisId},
                {description: stateProps.newDescription, typeId: stateProps.typeId},
                false
            );
            await dispatchProps.closeModal();
            dispatchProps.loadAnalysis({id: stateProps.analysisId});
        },
    });
}

let ReduxModalUpdateDescription = ModalUtils.connect({
    name: modal.updateAnalysisDescription,
})(ModalUpdateDescription);

ReduxModalUpdateDescription = reduxForm({
    form: form.updateAnalysisDescription,
    enableReinitialize: true,
})(ReduxModalUpdateDescription);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalUpdateDescription);
