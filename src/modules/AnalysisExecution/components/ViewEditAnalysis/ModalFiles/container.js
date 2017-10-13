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
 * Created: December 13, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { ModalUtils } from 'arachne-ui-components';
import { apiPaths, modal, maxFilesCount, paths } from 'modules/AnalysisExecution/const';
import actions from 'actions/index';
import { Utils } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';

class ModalFiles extends Component {
  constructor() {
    super();
    this.state = {
      filterText: '',
    };
    this.filter = this.filter.bind(this);
  }

  static get propTypes() {
    return {
      isOpened: PropTypes.bool,
      isResults: PropTypes.bool,
      submissionId: PropTypes.number,
      submissionGroupId: PropTypes.number,
      loadSubmissionGroupFiles: PropTypes.func,
      loadSubmissionFiles: PropTypes.func,
      flush: PropTypes.func,
      filesCount: PropTypes.number,
      showModal: PropTypes.func,
    };
  }

  componentWillMount() {
    if (
      this.props.prevPath.startsWith(paths.submissionCodeFile({ submissionGroupId: this.props.submissionGroupId, fileId: '' })) ||
      this.props.prevPath.startsWith(paths.submissionResultFile({ submissionId: this.props.submissionId, fileId: '' }))
    ) {
      this.props.showModal();
    } else {
      this.props.closeModal();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened === false && nextProps.isOpened === true) {
      if (nextProps.filesCount <= maxFilesCount) {
        if (nextProps.isResults) {
          this.props.loadSubmissionFiles(nextProps.submissionId);
        } else {
          this.props.loadSubmissionGroupFiles(nextProps.submissionGroupId);
        }
      }
    } else if (this.props.isOpened === true && nextProps.isOpened === false) {
      this.props.flush();
    }
  }

  filter(filterText) {
    this.setState({
      filterText,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      filter: this.filter,
    });
  }
}

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const modalState = get(state, 'modal.analysisFiles');
  const submissionGroupId = get(modalState, 'data.submissionGroupId');
  const submissionId = get(modalState, 'data.submissionId');
  const canRemoveFiles = get(modalState, 'data.canRemoveFiles');

  let title;
  let downloadAllLink;
  let files;
  const isResults = get(modalState, 'data.type') === 'result';
  let filesCount = get(modalState, 'data.resultFilesCount', 0);
  if (isResults) {
    title = 'Results';
    downloadAllLink = apiPaths.submissionResultAll({ submissionId });
    files = selectors.getResultFiles(state);
  } else {
    title = 'Code files';
    downloadAllLink = apiPaths.submissionGroupCodeAll({ submissionGroupId });
    files = selectors.getQueryFiles(state);
    filesCount = get(modalState, 'data.queryFilesCount');
  }
  const isOpened = get(modalState, 'isOpened', false);
  const isLoading = get(state, 'analysisExecution.analysisCode.isLoading', false);
  const prevPath = get(state, 'routingHistory.prevLocation.pathname', '');

  return {
    analysisId: get(analysisData, 'id'),
    submissionId,
    downloadAllLink,
    title,
    fileList: files,
    canRemoveFiles,
    isOpened,
    submissionGroupId,
    isResults,
    isLoading,
    filesCount,
    prevPath,
  };
}

const mapDispatchToProps = {
  showModal: () => ModalUtils.actions.toggle(modal.analysisFiles, true),
  closeModal: () => ModalUtils.actions.toggle(modal.analysisFiles, false),
  loadAnalysis: actions.analysisExecution.analysis.find,
  removeResult: actions.analysisExecution.resultFile.delete,
  loadSubmissionGroupFiles: groupId =>
    actions.analysisExecution.analysisCode.codeList.query({
      entityId: groupId,
      isSubmissionGroup: true,
    }),
  loadSubmissionFiles: submissionId =>
    actions.analysisExecution.analysisCode.codeList.query({
      entityId: submissionId,
      isSubmissionGroup: false,
    }),
  flush: actions.analysisExecution.analysisCode.flush,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    removeResult: (fileId) => {
      Utils.confirmDelete()
        .then(() => {
          dispatchProps
            .removeResult({ submissionId: stateProps.submissionId, fileId })
            .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));
        });
    },
  };
}

const ReduxModalFiles = ModalUtils.connect({
  name: modal.analysisFiles,
  persistant: true,
})(ModalFiles);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalFiles);
