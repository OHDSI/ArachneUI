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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import DraggableList from 'react-draggable-list';
import moment from 'moment-timezone';
import { Button, Link, ListItem } from 'arachne-ui-components';
import FileInfo from 'components/FileInfo';
import BEMHelper from 'services/BemHelper';
import { commonDate as commonDateFormat } from 'const/formats';

require('./style.scss');

function AddDocument({ openCreateModal }) {
  const classes = new BEMHelper('study-document-list-add');

  return (
    <Button
      {...classes()}
      onClick={openCreateModal}
    >
      <i {...classes('ico')}>
        add_circle_outline
      </i>
      <span {...classes('label')}>
        Add document
      </span>
    </Button>
  );
}

function DocumentItem({ document, isEditable, removeDocument }) {
  const classes = new BEMHelper('study-document-item');
  const mods = {
    hover: true,
    removable: isEditable,
  };
  return (
    <ListItem
      {...classes()}
      mods={mods}
      onRemove={() => removeDocument(document.uuid)}
    >
      <FileInfo {...document} />
    </ListItem>
  );
}

DocumentItem.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  removeDocument: PropTypes.func.isRequired,
};

function ListDocuments(props) {
  const classes = new BEMHelper('study-document-list');
  const classesLoadAll = new BEMHelper('study-document-list-download-all');
  const tooltipClass = new BEMHelper('tooltip');

  const {
    isEditable,
    downloadAllLink,
    openCreateModal,
    documentList,
    removeDocument,
    canDownload,
  } = props;

  return (
    <div {...classes()}>
      <ul {...classes('content')}>
        {documentList.map((document, key) =>
          <DocumentItem
            document={document}
            isEditable={isEditable}
            removeDocument={removeDocument}
            key={key}
          />
        )}
        {documentList.length === 0 &&
          <ListItem label={'No documents available'} />
        }
      </ul>
      <div {...classes('actions')}>
        {isEditable &&
          <AddDocument openCreateModal={openCreateModal} />
        }
        {canDownload &&
          <div 
            {...classesLoadAll({ extra: tooltipClass().className })}
              aria-label='Download all documents'
          >
            <Button
              {...classesLoadAll('ico')}
              link={downloadAllLink}
              target="_self"
            >
              file_download
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

ListDocuments.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  documentList: PropTypes.array.isRequired,
  downloadAllLink: PropTypes.string.isRequired,
  openCreateModal: PropTypes.func.isRequired,
  removeDocument: PropTypes.func.isRequired,
  canDownload: PropTypes.bool,
};

export default ListDocuments;
