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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import moment from 'moment-timezone';
import {
  Button,
  Modal,
  ListItem,
  LoadingPanel,
} from 'arachne-ui-components';
import FileInfo from 'components/FileInfo';
import { commonDate as commonDateFormat } from 'const/formats';
import { maxFilesCount } from 'modules/AnalysisExecution/const';
import EmptyState from 'components/EmptyState';
import { numberFormatter } from 'services/Utils';
import Fuse from 'fuse.js';
import searchSettings from 'const/search';

require('./style.scss');

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
        horizontal
        docType={file.docType}
        label={file.label || file.name}
        createdAt={file.createdAt}
        link={file.link}
        linkTaret={file.linkTarget}
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
          : <ul {...classes('list')}>
            <ListItem>
              <input
                {...classes('filter')}
                value={filterText}
                placeholder={'Filter by name or type'}
                onChange={e => filter(e.target.value)}
              />
            </ListItem>
            {fileList.map((file, key) =>
              <FileItem
                file={file}
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
