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
import { connect } from 'react-redux';
import { get } from 'services/Utils';
import actions from 'actions/index';
import { downloadLinkBuilder } from 'modules/AnalysisExecution/ducks/submissionFile';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import ReportUtils from 'components/Reports/Utils';
import { reports, treemapReports } from 'const/reports';
import { fileTypes, paths } from 'modules/AnalysisExecution/const';
import FileTreeUtils from 'services/FileTreeUtils';
import convertDetailsDataToReportData from './components/ReportViewer/converters/reportDetailsToReportData';
import DTO from './components/ReportViewer/converters/DTO';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = new SelectorsBuilder().build();

class SubmissionCode extends Component {

  componentWillMount() {
    this.props.loadBreadcrumbs({
      entityType: this.props.from,
      id: this.props.submissionGroupId || this.props.submissionId,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.submissionId) {
      if (get(this.props.file, 'uuid') !== get(nextProps.file, 'uuid')) {
        let loadPromise = new Promise(resolve => resolve());
        if (get(this.props.file, 'submissionId') !== get(nextProps.file, 'submissionId')) {
          const folderPath = FileTreeUtils.getFileFolder(nextProps.file.relativePath);
          loadPromise = nextProps.toggleFolder({ relativePath: folderPath }, true);
        }
        loadPromise.then(
          () => this.props.selectFileInTree({ relativePath: nextProps.file.relativePath })
        );
      }
    }
  }

  componentWillUnmount() {
    this.props.flushFileTree();
    this.props.clearFileData();
    this.props.clearDetailsData();
  }

  render() {
    return presenter(this.props);
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

function mapStateToProps(state, ownProps) {
  const from = ownProps.route.from;
  const type = ownProps.route.type;

  const submissionGroupId = ownProps.params.submissionGroupId;
  const submissionId = ownProps.params.submissionId;
  const fileUuid = ownProps.params.fileUuid;

  const isFileLoading = get(state, 'analysisExecution.submissionFile.isLoading', false);
  const isLoading = get(state, 'analysisExecution.breadcrumbs.isLoading', false)
    || isFileLoading;

  const pageTitle = [
    get(state, 'analysisExecution.submissionFile.data.result.name', 'Code file'),
    ...(get(state, 'analysisExecution.breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
    'Arachne',
  ];

  const downloadLink = downloadLinkBuilder({ type, submissionGroupId, submissionId, fileId: fileUuid, downloadFile: true });

  const submissionFileData = get(state, 'analysisExecution.submissionFile.data.result');
  const submissionFileDetails = get(state, 'analysisExecution.submissionFileDetails.data.result');
  const filename = get(submissionFileData, 'name', '');

  const urlParams = {
    type,
    submissionGroupId,
    submissionId,
    fileId: fileUuid,
  };

  const breadcrumbList = buildBreadcrumbList(get(state, 'analysisExecution.breadcrumbs.queryResult.result'));
  const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;

  const toolbarOpts = {
    backUrl,
    breadcrumbList,
    title: get(submissionFileData, 'label') || get(submissionFileData, 'name'),
  };

  let reportType = reports.unknown;
  let isReport = false;
  let reportDTO = {};
  let tableData = {};
  let tableColumns = {};
  let details = {};
  let isDetailsLoading = get(state, 'analysisExecution.submissionFileDetails.isLoading', false);
  if (submissionFileData && submissionFileData.content) {
    reportType = ReportUtils.getReportType(get(submissionFileData, 'docType'));
    isReport = reportType !== reports.unknown;
    if (isReport) {
      try {
        const file = JSON.parse(submissionFileData.content);

        // change key names in JSON and it's structure
        const structure = Object.entries(file);
        structure.forEach(([key, value]) => {
          reportDTO[key] = ReportUtils.arrayToDataframe(value);
        });

        if (treemapReports.includes(reportType)) {
          reportDTO = Object.entries(reportDTO)[0][1];
          tableData = selectors.getTableData(reportType, reportDTO);
          tableColumns = {};
          Object.entries(tableData[0]).forEach(([key, value]) => {
            tableColumns[key] = value.columnName;
          });
        }
      } catch (er) {}
    }
  }
  if (submissionFileDetails && submissionFileDetails.content) {
    try {
      const file = JSON.parse(submissionFileDetails.content);

      // change key names in JSON and it's structure
      const structure = Object.entries(file);
      structure.forEach(([key, value]) => {
        details[key] = ReportUtils.arrayToDataframe(value);
      });
      details = convertDetailsDataToReportData(details, DTO[reportType]);
    } catch (er) {}
  }

  return {
    urlParams,
    file: isReport
      ? reportDTO
      : submissionFileData,
    isLoading,
    toolbarOpts,
    pageTitle: pageTitle.join(' | '),
    downloadLink,
    from,
    submissionGroupId,
    submissionId,

    isReport,
    reportType,
    filename,

    // treemap reports
    tableData,
    tableColumns,
    details,
    isDetailsLoading,

    treeData: selectors.getFileTreeData(state),
    selectedFilePath: selectors.getSelectedFileFromTree(state),
  };
}

const mapDispatchToProps = {
  loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
  loadFile: actions.analysisExecution.submissionFile.find,
  loadDetails: actions.analysisExecution.submissionFileDetails.find,
  loadSubmissionResultFiles: actions.analysisExecution.analysisCode.search,
  clearFileData: actions.analysisExecution.submissionFile.clear,
  clearDetailsData: actions.analysisExecution.submissionFileDetails.clear,

  loadFilesTree: actions.analysisExecution.fileTreeData.query,
  toggleFileTreeNode: actions.analysisExecution.fileTreeData.toggle,
  selectFileInTree: actions.analysisExecution.fileTreeData.selectFile,
  flushFileTree: actions.analysisExecution.fileTreeData.flush,
  goToPage: actions.router.goToPage,
};

function mergeProps(stateProps, dispatchProps, ownProps) {

  const loadFilesTree = ownProps.route.type === 'result'
      ? (path = '/' ) => dispatchProps.loadFilesTree(
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
    loadTreemapDetails({ filename }) {
      let path = '';
      const isRoot = stateProps.filename.lastIndexOf('/') === -1;
      if (!isRoot) {
        path = `${stateProps.filename.substr(0, stateProps.filename.lastIndexOf('/'))}/`;
      }
      const realname = `${path}${stateProps.reportType}/${filename}.json`;
      dispatchProps.loadSubmissionResultFiles(
        {
          entityId: stateProps.submissionId,
        },
        {
          'real-name': realname,
        }
      ).then(detailedFiles => dispatchProps.loadDetails({
        type: 'result',
        submissionGroupId: stateProps.submissionGroupId,
        submissionId: stateProps.submissionId,
        fileId: get(detailedFiles, '[0].uuid', '1'),
      }));
    },
    toggleFolder({ relativePath }, state) {
      let loadPromise = new Promise(resolve => resolve());

      if (state === true) {
        const nodeList = FileTreeUtils.findNodeByPath(stateProps.treeData, relativePath, true);
        const pathPartsToShow = [
          FileTreeUtils.PATH_SEPARATOR,
          ...relativePath.split(FileTreeUtils.PATH_SEPARATOR)
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SubmissionCode);
