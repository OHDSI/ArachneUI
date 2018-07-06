/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: July 4, 2018
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Button } from 'arachne-ui-components';

require('./style.scss');

interface IModalStateProps {
  licenses: Array<string>;
  message: string;
};

interface IModalDispatchProps {
  goToLicenses: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
  modal: string;
  removeVocabulary: (id: number) => any;
};

function ModalRequestLicenses(props: IModalProps) {
  const {
    modal,
    licenses,
    message,
    goToLicenses,
  } = props;
  const classes = BEMHelper('modal-licenses');

  return (
    <div {...classes()}>
      <Modal modal={modal} title='Licenses needed'>
        <p {...classes('message')}>
          You need some licenses ({licenses.length}) in order to {message} this bundle. Please, request them on Download page. The required vocabularies will be pre-selected.
        </p>
        <div {...classes('actions')}>
          <Button mods={['success']} onClick={goToLicenses}>Request</Button>
        </div>
      </Modal>
    </div>);
}

export default ModalRequestLicenses;
export {
  IModalProps,
  IModalStateProps,
  IModalDispatchProps,
};
