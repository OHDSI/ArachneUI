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
 * Authors: Pavel Grafkin
 * Created: May 11, 2017
 *
 */

import React, { Component, PropTypes } from 'react';
import mimeTypes from 'const/mimeTypes';
import FileTree from './presenter';

class FileTreeWrapper extends Component {

  static propTypes() {
    return {
      toggleFolder: PropTypes.func,
      openFile: PropTypes.func,
      data: PropTypes.array,
      selectedFilePath: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.oneOf(['upload', 'remove'])),
      doDelete: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.collapseNode = this.collapseNode.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  onNodeClick(node) {
    const {
      docType,
      isLoading,
    } = node;

    if (isLoading) {
      return;
    } else if (docType === mimeTypes.folder) {
      this.props.toggleFolder(node, !node.isExpanded);
    } else {
      this.props.openFile(node);
    }
  }

  collapseNode({ path }) {
    this.openDirList = this.openDirList.filter(item => item !== path);
  }

  render() {
    const entryList = Array.isArray(this.props.data) ? this.props.data: this.props.data.children;
    const isFlat = entryList.find(entry => entry.docType === mimeTypes.folder) === undefined;

    return (
      <FileTree
        {...this.props}
        data={entryList}
        onNodeClick={this.onNodeClick}
        isFlat={isFlat}
        permissions={this.props.permissions}
        doDelete={this.props.doDelete}
      />
    );
  }
}

export default FileTreeWrapper;
