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
import EmptyState from 'components/EmptyState';
import File from './File';
import BEMHelper from 'services/BemHelper';

import './style.scss';

export default function FileBrowser(props) {
  const {
    className,
    children,
    selectedFile,
  } = props;
  // files list
  const {
    filesList,
    getFilesList,
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
      <div {...classes('files-list')}>
        {Array.isArray(filesList) && filesList.length
          ? filesList.map(file => <File file={file} selected={file.uuid === selectedFile} />)
          : <EmptyState message={'No files available'} />
        }
      </div>
      <div {...classes('details')}>
        {selectedFile
          ? detailsComponent
          : mainInfoComponent
        }
      </div>
    </div>
  );
}
