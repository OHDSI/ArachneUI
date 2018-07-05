/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
	Modal,
	FormCheckboxList,
	Form,
  TabbedPane,
  RadioButton,
  Button,
} from 'arachne-ui-components';
import { Vocabulary } from 'modules/Admin/components/Licenses/types';
import { Field } from 'redux-form';

require('./style.scss');

function VocRadioButton ({ options, input }) {
  const classes = BEMHelper('pending-radio-btn');

  return <RadioButton
    {...classes()}
    isChecked={input.value === options.value}
    onChange={() => input.onChange(options.value)}
  />;
}

function ModalEditPermissions(props) {
  const {
    modal,
    vocabularies,
    user,
    doSubmit,
    pendingVocabularies,
    handleSubmit,
  } = props;
  const classes = BEMHelper('edit-permissions');

  const sections = [
    {
      label: `Granted (${vocabularies.length})`,
      content: <div {...classes('tab-content')}>
        <Field component={FormCheckboxList} options={vocabularies} name='vocabularies' />
      </div>,
    },
    {
      label: `Pending (${pendingVocabularies.length})`,
      content: <div {...classes('tab-content')}>
        <div {...classes('pending-voc')}>
          <span {...classes('pending-voc-name')}></span>
          <div {...classes('pending-button')}>Allow</div>
          <div {...classes('pending-button')}>Forbid</div>
        </div>
        {pendingVocabularies.map((voc: Vocabulary) =>
          <div {...classes('pending-voc')}>
            <span {...classes('pending-voc-name')}>{voc.name}</span>
            <div {...classes('pending-button')}>
              <Field
                component={VocRadioButton}
                name={`pendingVocabs[${voc.licenseId}]`}
                options={{ value: true }}
              />
            </div>
            <div {...classes('pending-button')}>
              <Field
                component={VocRadioButton}
                name={`pendingVocabs[${voc.licenseId}]`}
                options={{ value: false }}
              />
            </div>
          </div>
        )}
      </div>
    },
  ];

  return (
    <div {...classes()}>
      <Modal modal={modal} title={`Edit permissions for user ${user}`} mods={['no-padding']}>
        <form
          onSubmit={handleSubmit(doSubmit)}
          {...props}
        >
          {pendingVocabularies.length > 0
            ? <TabbedPane sections={sections} />
            : sections[0].content
          }
          <div {...classes('submit-button-wrapper')}>
            <Button {...classes('submit-button')} type='submit' mods={['submit', 'rounded']}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>);
}

export default ModalEditPermissions;
