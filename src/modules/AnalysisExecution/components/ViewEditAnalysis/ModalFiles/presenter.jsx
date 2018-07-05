/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import moment from 'moment-timezone';
import {
  Button,
  Modal,
  Link,
  ListItem,
  LoadingPanel,
} from 'arachne-ui-components';
import FileInfo from 'components/FileInfo';
import { commonDate as commonDateFormat } from 'const/formats';
import mimeTypes from 'const/mimeTypes';
import { maxFilesCount } from 'modules/AnalysisExecution/const';
import EmptyState from 'components/EmptyState';
import { numberFormatter } from 'services/Utils';
import Fuse from 'fuse.js';
import searchSettings from 'const/search';

require('./style.scss');

function getChildFolderPath({ currentPath, file: { name: folderName } }) {
  return (currentPath !== '/' ? `${currentPath}/` : '') + folderName;
}

function getBackPath({ path }) {
  const pathParts = path.split('/');
  pathParts.pop();
  return pathParts.join('/') || '/';
}

function constructAddressBarItems({ path = '', items = [] }) {
  const cleanPath = path.replace(/^\/$/, '');

  if (cleanPath.length === 0) {
    return items;
  } else {
    const newItems = items.slice();

    const pathParts = path.split('/');
    const currentPathPart = pathParts.pop();
    const restPath = pathParts.join('/');

    newItems.unshift({
      label: currentPathPart,
      path: `${restPath}${restPath ? '/' : ''}${currentPathPart}`,
    });

    return constructAddressBarItems({
      path: restPath,
      items: newItems,
    });
  }
}

function FileAddressBar({ path = '', loadFolder }) {
  const classes = new BEMHelper('analysis-modal-files-address-bar');
  const itemList = constructAddressBarItems({ path });

  itemList.unshift({
    label: 'Results',
    path: '/',
  });

  return (
    <div {...classes()}>
      {itemList.map((item) =>
        <Link {...classes('item')} onClick={() => loadFolder({ path: item.path })}>
          {item.label}
        </Link>
      )}
    </div>
  );
}

function BackFolder({ currentPath, loadFiles }) {
  if (currentPath !== '/') {
    const backFolderFile = {
      docType: mimeTypes.folder,
      label: '..',
      onClick: () => loadFiles({ path: getBackPath({ path: currentPath }) }),
    };
    return (
      <FileItem file={backFolderFile} isEditable={false} />
    );
  }
  return null;
}

function FileItem({ file, isEditable, removeResult, isHidden }) {
  const classes = new BEMHelper('analysis-modal-files-item');
  const mods = {
    hover: true,
    removable: isEditable,
  };
  return (
    <ListItem
      {...classes({ modifiers: { hidden: isHidden } })}
      mods={mods}
      onRemove={() => removeResult(file.uuid)}
    >
      <FileInfo
        mods={['horizontal']}
        docType={file.docType}
        label={file.label || file.name}
        createdAt={file.createdAt}
        link={file.link}
        onClick={file.onClick}
        linkTaret={file.linkTarget}
        antivirusStatus={file.antivirusStatus}
        antivirusDescription={file.antivirusDescription}
      />
    </ListItem>
  );
}

function ModalFiles(props) {
  const classes = new BEMHelper('analysis-modal-files');
  const {
    closeModal,
    downloadAllLink,
    title,
    fileList,
    removeResult,
    canRemoveFiles,
    isLoading,
    filesCount,
    filterText,
    filter,
    canDownload,

    filesPath,
    loadSubmissionFiles,
  } = props;
  const fuseSearch = new Fuse(fileList, {
    ...searchSettings,
    keys: [
      'name',
      'label',
      'docType',
    ],
  });
  const filteredFiles = filterText ? fuseSearch.search(filterText) : fileList;
  const filteredFilesIds = {};
  filteredFiles.forEach((file) => {
    filteredFilesIds[file.uuid] = true;
  });

  return (
    <Modal modal={props.modal} title={title} mods={['no-padding']}>
      <div {...classes({ modifiers: { empty: isLoading } })}>
        {filesCount > maxFilesCount
          ? <div {...classes('empty-state')}>
            <EmptyState message={`Output contains ${numberFormatter.format(filesCount)} files and is too big to preview`} />
          </div>
          :
          <div>
            <div {...classes('adress-bar')}>
              <FileAddressBar path={filesPath} loadFolder={loadSubmissionFiles} />
            </div>
            <ul {...classes('list')}>
              <ListItem {...classes('filter-box')}>
                <input
                  {...classes('filter')}
                  value={filterText}
                  placeholder={'Filter by name or type'}
                  onChange={e => filter(e.target.value)}
                />
              </ListItem>
              <BackFolder
                currentPath={filesPath}
                loadFiles={loadSubmissionFiles}
              />
              {fileList.map((file, key) =>
                <FileItem
                  file={
                    {
                      ...file,
                      link: file.docType === mimeTypes.folder ? null : file.link,
                      onClick: file.docType === mimeTypes.folder ? () => loadSubmissionFiles({ path: getChildFolderPath({ currentPath: filesPath, file }) }) : null,
                    }
                  }
                  key={key}
                  isEditable={canRemoveFiles && file.manuallyUploaded}
                  removeResult={removeResult}
                  isHidden={!filteredFilesIds[file.uuid]}
                />
              )}
              {!filteredFiles.length &&
                <ListItem mods={['borderless']}>
                  <EmptyState message={fileList.length > 0 ? 'No files that match criteria' : 'No files'} />
                </ListItem>
              }
            </ul>
          </div>
        }
        {filesCount !== 0 &&
          <div {...classes('actions')}>
            {canDownload
              ? <Button
                {...classes('btn')}
                mods={['success', 'rounded']}
                label="Download all"
                link={downloadAllLink}
                target="_self"
              />
              : null
            }
            <Button
              {...classes('btn')}
              mods={['cancel', 'rounded']}
              label="Cancel"
              onClick={closeModal}
            />
          </div>
        }
      </div>
      <LoadingPanel active={isLoading} label={''} />
    </Modal>
  );
}

export default ModalFiles;
