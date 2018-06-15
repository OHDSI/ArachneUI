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
 * Created: December 26, 2017
 *
 */

import { SubmissionCodeBuilder, SubmissionCode } from 'modules/AnalysisExecution/components/SubmissionCodeViewer/container';
import actions from 'actions';
import { get } from 'services/Utils';
import { SubmissionResultLinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import { push as goToPage } from 'react-router-redux';
import { paths, fileTypes, modal } from 'modules/AnalysisExecution/const';
import mimeTypes from 'const/mimeTypes';
import FileTreeUtils from 'services/FileTreeUtils';
import SubmissionResultSelectors from './selectors';
import { ModalUtils } from 'arachne-ui-components';
import { DownloadAll } from 'modules/AnalysisExecution/components/SubmissionCodeViewer/ResultFile/components/ToolbarButtons/presenter';

class SubmissionResultFile extends SubmissionCode {
  componentWillMount() {
    super.componentWillMount();
    if (!this.props.params.fileId) {
      this.updateTree(this.props);
    }
    this.LinkBuilder = new SubmissionResultLinkBuilder({
      submissionId: this.props.params.submissionId,
      fileId: this.props.params.fileId,
      downloadFile: true,
    });
    this.doDelete = this.doDelete.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.props.loadSubmission({ id: this.props.submissionId });
  }

  async reloadTree(props) {
    await this.props.loadFilesTree(
      {
        type: fileTypes.SUBMISSION_RESULT,
        entityId: props.submissionId,
      },
      {
        path: '/',
      }
    );
    this.updateTree(props);
  }

  async componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (get(this.props.file, 'uuid') !== get(nextProps.file, 'uuid')) {
      this.updateTree(nextProps);
      this.LinkBuilder.params = {
        submissionId: nextProps.params.submissionId,
        fileId: nextProps.params.fileId,
        downloadFile: true,
      };
    }
  }

  updateTree(props) {
    const isFileLoaded = props.file && props.file.relativePath;
    let folderPath = FileTreeUtils.PATH_SEPARATOR;
    if (isFileLoaded) {
      folderPath = FileTreeUtils.getFileFolder(props.file.relativePath);
    }
    props
      .toggleFolder({ relativePath: folderPath }, true, true)
      .then(() => {
        props.selectFileInTree({
          relativePath: isFileLoaded ? props.file.relativePath : '',
        });
      });
  }

  async doDelete(file) {
    await this.props.deleteFile({
      submissionId: file.submissionId,
      fileId: file.uuid,
    });
    this.reloadTree(this.props);
  }

  onUpload() {
    this.reloadTree(this.props);
  }

  getRenderParams() {
    return {
      ...super.getRenderParams(),
      doDelete: this.doDelete,
      // add a link to summary
      summary: {
        onClick: () => this.props.showSummary({ submissionId: this.props.submissionId }),
        label: 'Summary',
        isSelected: this.props.selectedFilePath === '',
      },
      onUpload: this.onUpload,
    };
  }
}

export default class SubmissionResultFileViewerBuilder extends SubmissionCodeBuilder {
  constructor() {
    super();
    this.selectors = new SubmissionResultSelectors().build();
  }

  getComponent() {
    return SubmissionResultFile;
  }

  mapStateToProps(state, ownProps) {
    const permissions = this.selectors.getPermissions(state);
    const submissionStatus = this.selectors.getSubmissionStatus(state);
    const isUploadModalOpened = get(state, `modal.${modal.uploadResult}.isOpened`, false);
    const parentProps = super.mapStateToProps(state, ownProps);

    return {
      ...parentProps,
      treeData: this.selectors.getFileTreeData(state),
      isTreeLoading: this.selectors.getIsTreeLoading(state),
      permissions: {
        upload: permissions.APPROVE_SUBMISSION && submissionStatus === 'IN_PROGRESS',
        remove: permissions.APPROVE_SUBMISSION && submissionStatus === 'IN_PROGRESS',
      },
      isUploadModalOpened,
      toolbarOpts: {
        ...parentProps.toolbarOpts,
        children: [
          DownloadAll({ submissionId: parentProps.submissionId }),
        ],
      },
    };
  }

  getMapDispatchToProps() {
    return {
      ...super.getMapDispatchToProps(),
      loadFile: actions.analysisExecution.submissionResultFile.find,
      deleteFile: actions.analysisExecution.submissionResultFile.delete,
      clearFileData: actions.analysisExecution.submissionResultFile.clear,
      showSummary: ({ submissionId }) => goToPage(paths.submissionResultSummary({ submissionId })),

      loadFilesTree: actions.analysisExecution.fileTreeData.query,
      toggleFileTreeNode: actions.analysisExecution.fileTreeData.toggle,
      selectFileInTree: actions.analysisExecution.fileTreeData.selectFile,
      flushFileTree: actions.analysisExecution.fileTreeData.flush,
      goToPage: actions.router.goToPage,
      loadSubmission: actions.analysisExecution.submissionSummary.submission.find,
      showUploadModal: submissionId =>
        ModalUtils.actions.toggle(modal.uploadResult, true, { submissionId }),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    const loadFilesTree = (path = '/') => {
      return dispatchProps.loadFilesTree(
        {
          type: fileTypes.SUBMISSION_RESULT,
          entityId: stateProps.submissionId,
        },
        {
          path,
        }
      );
    };

    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      toggleFolder({ relativePath }, state, toggleParents = false) {
        let loadPromise = new Promise(resolve => resolve());

        if (state === true) {
          const nodeList = FileTreeUtils.findNodeByPath(stateProps.treeData, relativePath, true);
          let pathPartsToShow = [FileTreeUtils.PATH_SEPARATOR];
          if (relativePath !== FileTreeUtils.PATH_SEPARATOR) {
            pathPartsToShow = [
              ...pathPartsToShow,
              ...relativePath.split(FileTreeUtils.PATH_SEPARATOR),
            ];
          }

          let curPath = '';
          pathPartsToShow.forEach((pathPart, idx) => {
            curPath = FileTreeUtils.joinPathParts([curPath, pathPart]);
            if (!nodeList[idx] || !nodeList[idx].loaded) {
              loadPromise = loadPromise.then(((p) => () => loadFilesTree(p))(curPath));
            }
          });
        }

        return loadPromise.then(() =>
          dispatchProps.toggleFileTreeNode({ relativePath }, state, toggleParents)
        );
      },
      openFile(file) {
        dispatchProps.goToPage(paths.submissionResultFile({
          submissionId: stateProps.submissionId,
          fileId: file.uuid,
        }));
      },
    };
  }
}
