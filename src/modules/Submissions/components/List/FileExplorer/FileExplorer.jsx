import React, { Component } from 'react';
import { ContainerBuilder } from '../../../../../services/Utils';
import Api from 'services/Api';
import { apiPaths, links, paths } from '../../../const'
import BEMHelper from 'services/BemHelper';
import {
  Toolbar,
  LoadingPanel
} from 'arachne-ui-components';

import FileTree from 'components/FileTree';
import mimeTypes from 'const/mimeTypes';
import URI from 'urijs';
import { detectLanguageByExtension, detectMimeTypeByExtension } from 'services/Utils';
import MediaViewer from 'components/MediaViewer';
import { toFileTree } from "./utils";

import './style.scss';

function FileBrowser(props) {
  const {
    className = 'br',
    children,
    selectedFile,
    toolbarOpts,
    isTreeLoading = false,
    fileTreeData = { children: [] },
    selectedFilePath,
    toggleFolder,
    openFile,
    permissions,
    doDelete,
    headerBtns,
    summary,
    setContainer,
    container,
    submission,
    isLoading
  } = props;
  // main info
  const {
    mainInfoComponent,
  } = props;
  // details
  const {
    detailsComponent,
  } = props;

  const classes = BEMHelper('file-browser');
  const isFlat = fileTreeData.children.find(entry => entry.docType === mimeTypes.folder) === undefined;
  const isSummaryDisplaced = permissions?.remove || (!permissions?.remove && !isFlat);
  const classesDownload = new BEMHelper('button')({ modifiers: ['rounded', 'success'], extra: className });
  const url = links.downloadResults(submission?.id);

  return (
    <div {...classes({ extra: className })}>
      {toolbarOpts &&
        <Toolbar {...toolbarOpts} >
          <a {...classesDownload} href={url} type="button">Download all</a>
        </Toolbar>
      }
      <div {...classes('content')}>
        {fileTreeData || isTreeLoading
          ? <div {...classes('nav')} ref={(element) => {
            if (element && !container) {
              setContainer?.(element);
            }
          }}>
            <div {...classes('nav-header')}>
              <span {...classes('title')}>Browse files</span>
              {headerBtns}
            </div>
            <div {...classes('nav-content')}>
              <FileTree
                data={fileTreeData}
                selectedFilePath={selectedFilePath}
                toggleFolder={toggleFolder}
                openFile={openFile}
                permissions={permissions}
                doDelete={doDelete}
              />
            </div>
            <LoadingPanel active={isTreeLoading} label={'Loading files tree'} />
          </div>
          : null
        }
        <div {...classes('details')}>
          {selectedFile &&

            <MediaViewer
              language={selectedFile.language}
              mimeType={selectedFile.mimeType}
              data={selectedFile.content}
              // downloadLink={downloadLink}
              name={selectedFile.name}
              title={selectedFile.title}
              createdAt={selectedFile.createdAt}
              antivirusStatus={selectedFile.antivirusStatus}
              antivirusDescription={selectedFile.antivirusDescription}
            />

          }
          <LoadingPanel active={isLoading} />
        </div>
      </div>
      {children}
    </div>
  );
}


class FileBrowserComponent extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedFile: null,
      submission: null,
      isLoadingFile: false,
      isTreeLoading: false
    };
  }

  openFile(elem) {
    const that = this;
    this.setState({ isLoadingFile: true })
    const uri = new URI(apiPaths.loadFile(this.props.params.submissionId, elem.path));
    const mimeType = detectMimeTypeByExtension(elem);
    const language = detectLanguageByExtension(elem);
    Api.getFileRequest(
      'GET',
      uri.normalize().toString(),
      null,
      function (res) {
        that.setState({
          selectedFile: {
            content: res,
            language: language,
            mimeType: mimeType,
            name: elem.name,
            path: elem.path // probably redundant
          },
          isLoadingFile: false
        })
      }
    )
  }

  componentDidMount() {
    const that = this;
    const id = this.props.params.submissionId;
    that.setState({ isTreeLoading: true })
    // request submissions list to obtain single selected submission data
    // there is no separate endpoint to request submission details
    Api.sendRequest('GET', apiPaths.submissionList({ query: { size: 100000 } }), null, function (res) {
      that.setState({
        submission: res.content.find(item => item.id === id),
      })
    });

    Api.sendRequest(
      'GET',
      apiPaths.submissionResults(id),
      null,
      function (res) {
        const files = toFileTree(res) || []

        that.setState({
          files: files,
          selectedFile: null,
          isTreeLoading: false
        })
        that.openFile(files[0])
      }
    )
  }

  render() {
    return FileBrowser({
      fileTreeData: {
        children: this.state.files
      },
      selectedFile: this.state.selectedFile,
      selectedFilePath: this.state.selectedFile?.path,
      submission: this.state.submission,
      isLoading: this.state.isLoadingFile,
      // some hardcode
      toolbarOpts: {
        backUrl: paths.submissions(),
        breadcrumbList: [
          {
            label: 'Submissions',
            link: paths.submissions(),
          }
        ],
        caption: `${this.state.submission?.analysis} (${this.state.submission?.study})`,
      },
      openFile: (elem) => {
        this.openFile(elem);
      }
    });
  }
}

class FileBrowserBuilder extends ContainerBuilder {
  getComponent() {
    return FileBrowserComponent;
  }
  mapStateToProps(state) {
    return {

    };
  }

  getMapDispatchToProps() {
    return {

    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
    };
  }
}


export default new FileBrowserBuilder().build();