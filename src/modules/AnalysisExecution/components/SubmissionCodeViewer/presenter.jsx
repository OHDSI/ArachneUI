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

import React from 'react';
import FileViewer from 'components/FileViewer';
import FileBrowser from 'components/FileBrowser';
import ReportViewer from './components/ReportViewer';
import Summary from './components/Summary';

function SubmissionCodeViewer({
  file,
  isLoading,
  loadFile,
  toolbarOpts,
  downloadLink,
  urlParams,
  pageTitle,
  isReport = false,
  reportType,
  loadTreemapDetails,
  tableData,
  tableColumns,
  details,
  isDetailsLoading,

  resultFiles,
  submissionId,
  submissionGroupId,
}) {
    return <FileBrowser
      filesList={resultFiles}
      selectedFile={urlParams.fileId}
      detailsComponent={
        isReport
          ? <ReportViewer
            type={reportType}
            data={file}
            details={details}
            toolbarOpts={toolbarOpts}
            downloadLink={downloadLink}
            pageTitle={pageTitle}
            loadTreemapDetails={loadTreemapDetails}
            tableData={tableData}
            tableColumns={tableColumns}
            isLoading={isDetailsLoading}
          />
          : <FileViewer
            file={file}
            isLoading={isLoading}
            loadFile={loadFile}
            toolbarOpts={toolbarOpts}
            downloadLink={downloadLink}
            urlParams={urlParams}
            pageTitle={pageTitle}
          />
      }
      mainInfoComponent={<Summary
        submissionId={submissionId}
        submissionGroupId={submissionGroupId}
      />}
    />;
  /*return isReport
    ? <ReportViewer
      type={reportType}
      data={file}
      details={details}
      toolbarOpts={toolbarOpts}
      downloadLink={downloadLink}
      pageTitle={pageTitle}
      loadTreemapDetails={loadTreemapDetails}
      tableData={tableData}
      tableColumns={tableColumns}
      isLoading={isDetailsLoading}
    />
    : <FileViewer
      file={file}
      isLoading={isLoading}
      loadFile={loadFile}
      toolbarOpts={toolbarOpts}
      downloadLink={downloadLink}
      urlParams={urlParams}
      pageTitle={pageTitle}
    />;*/
}

export default SubmissionCodeViewer;
