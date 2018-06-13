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
 * Created: December 22, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, detectLanguageByExtension } from 'services/Utils';
import actions from 'actions/index';
import { apiPaths, analysisPermissions } from 'modules/AnalysisExecution/const';
import { isFat as isMimeTypeFat, isText } from 'services/MimeTypeUtil';
import { asyncConnect } from 'redux-async-connect';
import presenter from './presenter';

class AnalysisCode extends Component {
  componentWillReceiveProps(props) {
    if (!props.isLoading && !props.content && props.mimeType && !isMimeTypeFat(props.mimeType)) {
      this.props.loadAnalysisCode({
        analysisId: this.props.analysisId,
        analysisCodeId: this.props.analysisCodeId,
        withContent: !isMimeTypeFat(props.mimeType),
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

AnalysisCode.propTypes = {
  analysisId: PropTypes.number.isRequired,
  analysisCodeId: PropTypes.string.isRequired, // uuid
  loadAnalysis: PropTypes.func.isRequired,
  loadAnalysisCode: PropTypes.func.isRequired,
  loadBreadcrumbs: PropTypes.func,
  mimeType: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  const moduleState = state.analysisExecution;

  const analysisId = parseInt(ownProps.routeParams.analysisId, 10);
  const analysisCodeId = ownProps.routeParams.analysisCodeId;

  const downloadLink = apiPaths.analysisCodeDownload({
    analysisId,
    analysisCodeId,
  });

  const fileData = get(moduleState, 'analysisCode.data.result');
  const mimeType = get(fileData, 'docType', null, 'String');
  const content = get(fileData, 'content', null, 'String');
  const title = get(fileData, 'label', '');
  const name = get(fileData, 'name', '');
  const createdAt = get(fileData, 'created');
  const language = detectLanguageByExtension(fileData);
  const isLoading = get(moduleState, 'analysisCode.isLoading') || get(state, 'studyManager.studyInvitations.isLoading');
  const studyId = get(moduleState, 'analysis.data.result.study.id', -1);
  const antivirusStatus = get(fileData, 'antivirusStatus', false);
  const antivirusDescription = get(fileData, 'antivirusDescription');

  const isEditable = get(fileData, `permissions[${analysisPermissions.deleteAnalysisFiles}]`, false)

  const pageTitle = [
    get(fileData, 'name', 'Code file'),
    ...(get(moduleState, 'breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
    'Arachne',
  ];

  const isTextFile = isText(mimeType);

  return {
    isLoading: get(moduleState, 'analysisCode.isLoading', false) || get(moduleState, 'analysis.isLoading', false),
    pageTitle: pageTitle.join(' | '),
    isTextFile,
    analysisId,
    mimeType,
    downloadLink,
    analysisCodeId,
    /* to prevent calling setState() of an unmounted ViewerCore */
    content: isLoading ? null : content,
    title,
    name,
    createdAt,
    language,
    studyId,
    isEditable, 
    antivirusStatus,
    antivirusDescription,
  };
}

const mapDispatchToProps = {
  loadAnalysis: actions.analysisExecution.analysis.find,
  loadAnalysisCode: actions.analysisExecution.analysisCode.find,
  loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onBannerActed: () => dispatchProps.loadAnalysisCode({
      analysisId: stateProps.analysisId,
      analysisCodeId: stateProps.analysisCodeId,
      withContent: !isMimeTypeFat(stateProps.mimeType),
    }),
  };
}

const connectedAnalysisCode = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AnalysisCode);

export default asyncConnect([{
  promise: ({ params, store: { dispatch } }) => {
    const fetchers = {
      loadAnalysis: actions.analysisExecution.analysis.find.bind(null, { id: params.analysisId }),
      loadAnalysisCode: actions.analysisExecution.analysisCode.find.bind(null, {
        analysisId: params.analysisId,
        analysisCodeId: params.analysisCodeId,
        withContent: false,
      }),
      loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query.bind(null, {
        entityType: 'ANALYSIS',
        id: params.analysisId,
      }),
    };
    return Promise.all(Object.values(fetchers).map(action => dispatch(action())));
  },
}])(connectedAnalysisCode);
