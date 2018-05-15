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
import BEMHelper from 'services/BemHelper';
import FileInfo from 'components/FileInfo';
import mimeTypes from 'const/mimeTypes';
import fileInfoConverter from 'components/FileInfo/converter';
import { Utils } from 'services/Utils';

require('./style.scss');

class FileTree extends Component {

  static propTypes() {
    return {
      data: PropTypes.arrayOf(PropTypes.shape({
        docType: PropTypes.string,
        isExpanded: PropTypes.bool,
        loaded: PropTypes.bool,
        onClick: PropTypes.func,
      })),
      selectedFilePath: PropTypes.string,
      onNodeClick: PropTypes.func,
      isNodeExpanded: PropTypes.func,
      collapseNode: PropTypes.func,
      permissions: PropTypes.arrayOf(PropTypes.oneOf(['upload', 'remove'])),
      doDelete: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);

    this.getNodeToggler = this.getNodeToggler.bind(this);
    this.getNode = this.getNode.bind(this);
  }

  getNodeToggler({ classes, docType, isLoading, isExpanded }) {
    const classname = 'node-toggle';
    let element;

    if (docType === mimeTypes.folder) {
      let icon;
      let modifiers;
      if (isLoading) {
        icon = 'refresh';
        modifiers = 'spinning';
      } else if (isExpanded) {
        icon = 'keyboard_arrow_down';
      } else {
        icon = 'keyboard_arrow_right';
      }
      element = <i {...classes(classname, modifiers)}>{icon}</i>;
    } else {
      element = (
        <span {...classes({
          element: classname,
          modifiers: {
            'no-toggle': true,
          },
        })} />
      );
    }
    return element;
  }

  getNode(props) {
    const {
      classes,
      node,
      onNodeClick,
      selectedFilePath,
      doDelete,
      permissions,
    } = props;

    const isSelected = node.relativePath === selectedFilePath;
    const mods = ['name-only', isSelected ? 'name-bold' : null];
    const isFolder = mimeTypes.folder === node.docType;

    return (
      <li {...classes('node', isSelected ? 'selected' : null)}>
        <div {...classes('node-details')} onClick={() =>
            node.onClick
              ? node.onClick()
              : onNodeClick(node)
          }>
          {
            this.getNodeToggler({
              ...node,
              classes,
            })
          }
          {permissions.remove && !isFolder
            ? <span
              {...classes('delete-handle')}
              onClick={(e) => {
                e.preventDefault();
                if (doDelete) {
                  Utils.confirmDelete({ message: 'Are you sure you want to delete this file?' })
                    .then(() => doDelete(node))
                    .catch(() => {});
                }
              }}
            >
              close
            </span>
            : null
          }
          <span {...classes('node-label')}>
            <FileInfo {...fileInfoConverter(node)} mods={mods} />
          </span>
        </div>
        {(node.children && node.isExpanded)
          ? <div {...classes('node-children')}>
            <FileTree
              data={node.children}
              onNodeClick={onNodeClick}
              selectedFilePath={selectedFilePath}
              isRoot={false}
              doDelete={doDelete}
              permissions={permissions}
            />
          </div>
          : null
        }
      </li>
    );
  }

  render() {
    const classes = new BEMHelper('file-tree');
    const {
      data,
      selectedFilePath,
      onNodeClick,
      isFlat,
      isRoot = true,
      doDelete,
      permissions = {
        upload: false,
        remove: false,
      },
    } = this.props;

    return (
      <ul {...classes({ modifiers: { isFlat, isRoot } })}>
        {data.map(node => this.getNode({
          classes,
          node,
          selectedFilePath,
          onNodeClick,
          doDelete,
          permissions,
        }))}
      </ul>
    );
  }

}

export default FileTree;
