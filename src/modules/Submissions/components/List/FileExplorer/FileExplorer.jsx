import React, { Component } from 'react';
import { ContainerBuilder } from '../../../../../services/Utils';
import Api from 'services/Api';
import { apiPaths } from '../../../const'
import BEMHelper from 'services/BemHelper';
import {
  Toolbar,
  LoadingPanel,
} from 'arachne-ui-components';
import FileTree from 'components/FileTree';
import FileInfo from 'components/FileInfo';
import mimeTypes from 'const/mimeTypes';
import fileInfoConverter from 'components/FileInfo/converter';
import FileViewer from 'components/FileViewer';
import URI from 'urijs';

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

  return (
    <div {...classes({ extra: className })}>
      {toolbarOpts &&
        <Toolbar {...toolbarOpts} />
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
            {/* <LoadingPanel active={isTreeLoading} label={'Loading files tree'} /> */}
          </div>
          : null
        }
        <div {...classes('details')}>
          {selectedFile &&
            <FileViewer
              // file={{
              //   ...file,
              //   label: createBreadcrumbs(get(file, 'relativePath', '', 'String')),
              // }}
              downloadLink={downloadLink}
              pageTitle={pageTitle}
              isLoading={isLoading}
            />
          }
        </div>
      </div>
      {children}
    </div>
  );
}


class Comp extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedFile: null
    };
  }
  componentDidMount() {
    const that = this;
    Api.sendRequest(
      'GET',
      apiPaths.submissionResults(this.props.params.submissionId),
      null,
      function (res) {
        that.setState({
          files: res.map(elem => {
            return {
              name: elem.path,
              ...elem
            }
          }),
          selectedFile: null
        })
      }
    )
  }
  render() {
    return FileBrowser({
      fileTreeData: {
        children: this.state.files
      },
      openFile: (elem) => {
        const that = this;
        const uri = new URI(apiPaths.loadFile(this.props.params.submissionId, elem.name));
        console.log(uri)
        console.log(elem)
        console.log(Api.getFileRequest)
        Api.getFileRequest(
          'GET',
          uri.normalize().toString(),
          null,
          function (res) {
            console.log(res)
            that.setState({
              selectedFile: res
            })
          }
        )
      }
    });
  }
}

class Test extends ContainerBuilder {
  getComponent() {
    return Comp;
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


export default new Test().build();
