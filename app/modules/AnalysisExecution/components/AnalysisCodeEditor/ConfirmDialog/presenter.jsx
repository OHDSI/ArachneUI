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
 * Created: February 08, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-components';
import { Modal } from 'arachne-components';
import React, { PropTypes } from 'react';

require('./style.scss');

function ConfirmDialog(props) {
  const classes = new BEMHelper('code-editor-confirm-dialog');

  return (
    <Modal {...props} title={'Cancel changes'}>
      <div {...classes()}>
        All the unsaved changes will be lost. Are you sure?
        <div {...classes('buttons')}>
          <Button mods={['success', 'rounded']} onClick={props.goToAnalysis}>Yes</Button>
          <Button {...classes('cancel')} mods={['cancel', 'rounded']} onClick={props.hideConfirmDialog}>No</Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  goToAnalysis: PropTypes.func,
  hideConfirmDialog: PropTypes.func,
};

export default ConfirmDialog;
