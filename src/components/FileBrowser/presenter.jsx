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
 * Created: December 20, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Toolbar,
  LoadingPanel,
} from 'arachne-ui-components';
import FileTree from 'components/FileTree';

import './style.scss';

export default function FileBrowser(props) {
  const {
    className,
    children,
    selectedFile,
    toolbarOpts,
    isTreeLoading = false,
    fileTreeData,
    selectedFilePath,
    toggleFolder,
    openFile,
    hasPermissions,
    doDelete,
    headerBtns,
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

  return (
    <div {...classes({ extra: className })}>
      {toolbarOpts &&
        <Toolbar {...toolbarOpts} />
      }
      <div {...classes('content')}>
        {fileTreeData || isTreeLoading
          ? <div {...classes('nav')}>
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
                hasPermissions={hasPermissions}
                doDelete={doDelete}
              />
            </div>
            <LoadingPanel active={isTreeLoading} label={'Loading files tree'} />
          </div>
          : null
        }
        <div {...classes('details')}>
          {selectedFile
            ? detailsComponent
            : mainInfoComponent
          }
        </div>
      </div>
      {children}
    </div>
  );
}
