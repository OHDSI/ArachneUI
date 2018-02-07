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
  * Created: Wednesday, February 7, 2018 11:35 AM
  *
  */

  import React from 'react';
  import { Modal } from 'arachne-ui-components';
  import BEMHelper from 'services/BemHelper';
  import DateInterval from './DateInterval';
  import Settings from './Settings';

  import './style.scss';

  function ModalStudyProperties(props) {
    const classes = new BEMHelper('modal-study-properties');

    return (
      <Modal modal={props.modal} title="Study properties">
        <div {...classes()}>
          <DateInterval />
          <Settings />
        </div>
      </Modal>
    );
  }

  export default ModalStudyProperties;
