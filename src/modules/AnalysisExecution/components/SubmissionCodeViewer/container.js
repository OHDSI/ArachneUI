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
    this.props.loadSubmissionFiles({ submissionId: this.props.submissionId });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.urlParams.fileId !== nextProps.urlParams.fileId && nextProps.urlParams.fileId) {
      this.props.loadFile({
        type: 'result',
        submissionGroupId: nextProps.submissionGroupId,
        submissionId: nextProps.submissionId,
        fileId: nextProps.urlParams.fileId,
        downloadFile: false,
        query: { withContent: false },
      });
    }
  }

  componentWillUnmount() {
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
  const analysis = selectors.getAnalysis(state);

  const toolbarOpts = {
    backUrl,
    breadcrumbList,
    caption: get(analysis, 'title'),
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
    file: submissionFileData,
    report: reportDTO,
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

    resultFiles: selectors.getSubmissionFilesList(state),
  };
}

const mapDispatchToProps = {
  loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
  loadFile: actions.analysisExecution.submissionFile.find,
  loadDetails: actions.analysisExecution.submissionFileDetails.find,
  loadSubmissionResultFiles: actions.analysisExecution.analysisCode.search,
  clearFileData: actions.analysisExecution.submissionFile.clear,
  clearDetailsData: actions.analysisExecution.submissionFileDetails.clear,
  loadSubmissionFiles: ({ submissionId, path = '/' }) =>
    actions.analysisExecution.analysisCode.codeList.query(
      {
        entityId: submissionId,
        isSubmissionGroup: false,
      },
      {
        path,
      }
    ),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SubmissionCode);
