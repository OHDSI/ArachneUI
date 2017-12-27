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
import ReportViewer from './ResultFile/components/ReportViewer';
import Summary from './ResultFile/components/Summary';

function SubmissionCodeViewer({
  file,
  isLoading,
  loadFile,
  toolbarOpts,
  downloadLink,
  urlParams,
  pageTitle,
  isReport = false,

  treeData,
  toggleFolder,
  openFile,
  selectedFilePath,
  isTreeLoading,

  resultFiles,
  submissionId,
  submissionGroupId,
}) {
  const fileViewer = (<FileBrowser
    filesList={resultFiles}
    selectedFile={urlParams.fileId}
    toolbarOpts={toolbarOpts}
    toggleFolder={toggleFolder}
    openFile={openFile}
    fileTreeData={treeData}
    isTreeLoading={isTreeLoading}
    selectedFilePath={selectedFilePath}
    loadFile={loadFile}
    urlParams={urlParams}
    detailsComponent={
      isReport
        ? <ReportViewer
          file={file}
          downloadLink={downloadLink}
          pageTitle={pageTitle}
          isLoading={isLoading}
          submissionId={submissionId}
          submissionGroupId={submissionGroupId}
        />
        : <FileViewer
          file={file}
          downloadLink={downloadLink}
          pageTitle={pageTitle}
          isLoading={isLoading}
        />
    }
    mainInfoComponent={<Summary
      submissionId={submissionId}
    />}
  />);

  return (
    fileViewer
  );
}

export default SubmissionCodeViewer;
