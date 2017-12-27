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
 * Created: June 13, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import actions from 'actions/index';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import ReportUtils from 'components/Reports/Utils';
import { reports } from 'const/reports';
import { LinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import { fileTypes, paths } from 'modules/AnalysisExecution/const';
import FileTreeUtils from 'services/FileTreeUtils';
import presenter from './presenter';

export class SubmissionCode extends Component {
  constructor() {
    super();
    this.LinkBuilder = new LinkBuilder();
  }

  componentWillMount() {
    this.props.loadBreadcrumbs({
      entityType: this.props.from,
      id: this.props.submissionGroupId || this.props.submissionId,
    });
  }

  loadTree(props) {
    let loadPromise = new Promise(resolve => resolve());
    let folderPath;
    if (props.file && props.file.relativePath) {
      folderPath = FileTreeUtils.getFileFolder(props.file.relativePath);
    } else {
      folderPath = FileTreeUtils.PATH_SEPARATOR;
    }
    loadPromise = props
      .toggleFolder({ relativePath: folderPath }, true)
      .then(
        () => {
          this.props.selectFileInTree({
            relativePath: props.file && props.file.relativePath
              ? props.file.relativePath
              : FileTreeUtils.PATH_SEPARATOR,
          });
        }
      );
  }

  componentWillUnmount() {
    this.props.clearFileData();
    this.props.clearDetailsData();
  }

  render() {
    return presenter({
      ...this.props,
      downloadLink: this.LinkBuilder.build(),
    });
  }
}

export class SubmissionCodeBuilder extends ContainerBuilder {
  constructor() {
    super();
    this.selectors = {};
  }

  getComponent() {
    return SubmissionCode;
  }

  mapStateToProps(state, ownProps) {
    const from = ownProps.route.from;
    const type = ownProps.route.type;
    const submissionGroupId = ownProps.params.submissionGroupId;
    const submissionId = ownProps.params.submissionId;
    const fileUuid = ownProps.params.fileUuid;

    const isFileLoading = this.selectors.getIsFileLoading(state);
    const isLoading = get(state, 'analysisExecution.breadcrumbs.isLoading', false)
      || isFileLoading;

    const pageTitle = [
      this.selectors.getPageTitle(state),
      ...(get(state, 'analysisExecution.breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
      'Arachne',
    ];

    const submissionFileData = this.selectors.getFileData(state);

    const urlParams = {
      type,
      submissionGroupId,
      submissionId,
      fileId: fileUuid,
    };

    const breadcrumbList = buildBreadcrumbList(get(state, 'analysisExecution.breadcrumbs.queryResult.result'));
    const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;
    const analysis = this.selectors.getAnalysis(state);

    const toolbarOpts = {
      backUrl,
      breadcrumbList,
      caption: get(analysis, 'title'),
    };

    let isReport = false;
    if (submissionFileData && submissionFileData.content) {
      const reportType = ReportUtils.getReportType(get(submissionFileData, 'docType'));
      isReport = reportType !== reports.unknown;
    }

    return {
      urlParams,
      file: submissionFileData,
      isLoading,
      toolbarOpts,
      pageTitle: pageTitle.join(' | '),
      from,
      submissionGroupId,
      submissionId,
      isReport,
      resultFiles: this.selectors.getSubmissionFilesList(state),
      selectedFilePath: this.selectors.getSelectedFileFromTree(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
      clearDetailsData: actions.analysisExecution.submissionFileDetails.clear,

      loadFilesTree: actions.analysisExecution.fileTreeData.query,
      toggleFileTreeNode: actions.analysisExecution.fileTreeData.toggle,
      selectFileInTree: actions.analysisExecution.fileTreeData.selectFile,
      goToPage: actions.router.goToPage,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    const loadFilesTree = ownProps.route.type === 'result'
    ? (path = '/') => dispatchProps.loadFilesTree(
      {
        type: fileTypes.SUBMISSION_RESULT,
        entityId: stateProps.submissionId,
      },
      {
        path,
      }
    )
    : null;

    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      toggleFolder({ relativePath }, state) {
        let loadPromise = new Promise(resolve => resolve());
  
        if (state === true) {
          const nodeList = FileTreeUtils.findNodeByPath(stateProps.treeData, relativePath, true);
          const pathPartsToShow = [
            FileTreeUtils.PATH_SEPARATOR,
            ...relativePath.split(FileTreeUtils.PATH_SEPARATOR),
          ];
  
          let curPath = '';
          pathPartsToShow.forEach((pathPart, idx) => {
            curPath = FileTreeUtils.joinPathParts([curPath, pathPart]);
            if (!nodeList[idx] || !nodeList[idx].loaded) {
              loadPromise = loadPromise.then(((p) => () => loadFilesTree(p))(curPath));
            }
          });
        }
  
        return loadPromise.then(() => dispatchProps.toggleFileTreeNode({ relativePath }, true));
      },
      openFile: (file) => {
        dispatchProps.goToPage(paths.submissionResultFile({
          submissionId: stateProps.submissionId,
          fileId: file.uuid,
        }));
      },
    };
  }
}

SubmissionCode.propTypes = {
  loadSubmissionFile: PropTypes.func,
  submissionGroupId: PropTypes.number,
  submissionId: PropTypes.string,
  from: PropTypes.string,
  loadBreadcrumbs: PropTypes.func,
  fileUuid: PropTypes.string,
  type: PropTypes.string,
};
