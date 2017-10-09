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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import get from 'lodash/get';
import BEMHelper from 'services/BemHelper';
import { Modal, TabbedPane, LoadingPanel } from 'arachne-ui-components';
import FilesUpload from './FilesUpload';
import LinksUpload from './LinksUpload';
import Import from './Import';

require('./style.scss');

function ModalCreateCode(props) {
  const classes = new BEMHelper('analysis-form-create-code');
  const sections = [
    {
      label: 'Computer',
      content: <FilesUpload />,
    },
    {
      label: 'Links',
      content: <LinksUpload />,
    },
    {
      label: 'Import',
      content: <Import />,
    },
  ];

  return (
    <div {...classes()}>
      <Modal modal={props.modal} title="Add code file">
        <div {...classes('content')}>
          <TabbedPane sections={sections} />
          <LoadingPanel isActive={props.isLoading} />
        </div>
      </Modal>
    </div>
  );
}

export default ModalCreateCode;
