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
 * Created: February 07, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Link, Modal } from 'arachne-components';
import { paths } from 'modules/StudyManager/const';

require('./style.scss');

function ModalConfirmDatasource(props) {
  const classes = new BEMHelper('datasource-confirm-study');
  const {
    approvedImmediately,
    datasourceName,
    modal,
    studyId,
    studyName,
    modalTitle = 'Attach data source',
    modalText = 'You attached',
  } = props;

  return (
    <Modal modal={modal} title={modalTitle}>
      <div {...classes()}>
      {modalText}<br />
        {datasourceName} for<br />
        <Link to={paths.studies(studyId)}>
          <span {...classes('study-name')}>
            {studyName}
          </span>
        </Link>
      </div>
    </Modal>
  );
}

export default ModalConfirmDatasource;
