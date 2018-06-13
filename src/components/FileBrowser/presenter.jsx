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
import FileInfo from 'components/FileInfo';
import mimeTypes from 'const/mimeTypes';
import fileInfoConverter from 'components/FileInfo/converter';

import './style.scss';

function SummaryItem(props) {
  const {
    classes,
    onClick,
    label,
    isSelected,
    displaced,
  } = props;
  const mods = ['name-only'];
  if (isSelected) {
    mods.push('name-bold');
  }

  return (
    <li {...classes('summary', isSelected ? 'selected' : null)} onClick={onClick}>
      <div {...classes('summary-details')}>
        <span {...classes({
          element: 'summary-label',
          modifiers: {
            displaced,
          },
        }
      )}>
          <FileInfo
            {...fileInfoConverter({
              ...props,
              docType: mimeTypes.home,
            })}
            mods={mods}
          />
        </span>
      </div>
    </li>
  );
}

export default function FileBrowser(props) {
  const {
    className,
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
  const isSummaryDisplaced = permissions.remove || (!permissions.remove && !isFlat);

  return (
    <div {...classes({ extra: className })}>
      {toolbarOpts &&
        <Toolbar {...toolbarOpts} />
      }
      <div {...classes('content')}>
        {fileTreeData || isTreeLoading
          ? <div {...classes('nav')} ref={(element) => {
            if (element && !container) {
              setContainer(element);
            }
          }}>
            <div {...classes('nav-header')}>
              <span {...classes('title')}>Browse files</span>
              {headerBtns}
            </div>
            <div {...classes('nav-content')}>
              {summary && <SummaryItem {...summary} classes={classes} displaced={isSummaryDisplaced} />}
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
