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
 * Created: November 10, 2017
 *
 */

import { ContainerBuilder, get } from 'services/Utils';
import ReportUtils from 'components/Reports/Utils';
import { treemapReports } from 'const/reports';
import FileLoader from 'components/FileViewer/container';
import actions from 'actions';
import convertDetailsDataToReportData from './converters/reportDetailsToReportData';
import DTO from './converters/DTO';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = new SelectorsBuilder().build();

class ReportViewer extends FileLoader {
  render() {
    return presenter(this.props);
  }
}

export default class ReportViewerBuilder extends ContainerBuilder {
  getComponent() {
    return ReportViewer;
  }

  mapStateToProps(state, ownProps) {
    const file = get(ownProps, 'file', {});
    let title = get(file, 'label', '');
    let reportDTO = {};
    let tableData = {};
    let tableColumns = {};
    const isDetailsLoading = get(state, 'analysisExecution.submissionFileDetails.isLoading', false);
    const submissionFileDetails = get(state, 'analysisExecution.submissionFileDetails.data.result');
    const createdAt = get(file, 'created');
    const reportType = ReportUtils.getReportType(get(file, 'docType'));
    const filename = get(file, 'name', '');
    let details = {};
    if (!title) {
      title = get(file, 'name', '');
    }

    try {
      const fileContent = JSON.parse(file.content);

      // change key names in JSON and it's structure
      const structure = Object.entries(fileContent);
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
    

    if (submissionFileDetails && submissionFileDetails.content) {
      try {
        const fileContent = JSON.parse(submissionFileDetails.content);

        // change key names in JSON and it's structure
        const structure = Object.entries(fileContent);
        structure.forEach(([key, value]) => {
          details[key] = ReportUtils.arrayToDataframe(value);
        });
        details = convertDetailsDataToReportData(details, DTO[reportType]);
      } catch (er) {}
    }

    return {
      title,
      createdAt,
      data: reportDTO,
      type: reportType,
     
      // treemap reports
      tableData,
      tableColumns,
      details,
      isDetailsLoading,

      filename,
    };
  }

  getMapDispatchToProps() {
    return {
      loadDetails: actions.analysisExecution.submissionFileDetails.find,
      loadSubmissionResultFiles: actions.analysisExecution.analysisCode.search,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      loadTreemapDetails({ filename }) {
        let path = `${stateProps.type}`;
        const filepath = get(ownProps.file, 'relativePath', '', 'String');
        const isRoot = filepath.lastIndexOf('/') === -1;
        if (!isRoot) {
          path = `${filepath.substr(0, filepath.lastIndexOf('/'))}/${stateProps.type}`;
        }
        const realname = `${filename}.json`;
        dispatchProps.loadSubmissionResultFiles(
          {
            entityId: ownProps.submissionId,
          },
          {
            path,
            'real-name': realname,
          }
        ).then(detailedFiles => dispatchProps.loadDetails({
          type: 'result',
          submissionGroupId: ownProps.submissionGroupId,
          submissionId: ownProps.submissionId,
          fileId: get(detailedFiles, '[0].uuid', '1'),
        }));
      },
    };
  }
}
