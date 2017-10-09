/**
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
 * Created: July 25, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Link,
  Panel,
  ListItem,
} from 'arachne-components';
import FileInfo from 'components/FileInfo';

require('./style.scss');

function DocumentPanel(props) {
  const classes = new BEMHelper('insight-view-document');
  const {
    files,
    deleteFile,
    title,
    openModal,
    canManageFiles,
  } = props;

  return (
    <Panel {...classes()} title={title}>
      {files && files.length ?
        files.map(file => <ListItem
          {...classes('value')}
        >
          <i {...classes('doctype-ico', file.docType)} />
          <Link
            {...classes('download-link')}
            target="_self"
            to={file.link}
          >
            {file.label || file.name}
          </Link>
          {canManageFiles &&
            <i
              {...classes('delete-ico')}
              onClick={() => deleteFile(file)}
            >
              close
            </i>
          }
        </ListItem>
      )
        : null
      }
      {canManageFiles &&
        <ListItem
          {...classes('value')}
          onClick={openModal}
        >
          <i {...classes('upload-ico')}>
            file_upload
          </i>
          {!files || !files.length
            ? 'No files attached'
            : 'Add files'}
        </ListItem>
      }
      {!canManageFiles && !files.length
        ? <ListItem
            {...classes('value')}
          >
            No files attached
          </ListItem>
        : null
      }
    </Panel>
  );
}

export default DocumentPanel;
