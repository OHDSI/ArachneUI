/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: April 14, 2017
 *
 */

import React from 'react';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';
import { Fieldset } from 'arachne-ui-components';
import { FormInput, FormCheckbox } from 'arachne-ui-components';

require('./style.scss');

function DynamicDataForm(props) {
  const classes = new BEMHelper('dynamic-data-form');

  const {
    doSubmit,
    dynamicFields,
    // redux-form props
    error,
    handleSubmit,
    submitting,
  } = props;

  const formFieldList = dynamicFields.map(field => {
    return {
      label: field.label,
      name: field.name,
      isRequired: field.isRequired,
      type: field.type,
      InputComponent: {
        component: field.type === 'checkbox' ? FormCheckbox : FormInput,
        props: {
          mods: ['bordered'],
          placeholder: field.label + ((field.isSet && field.value === null) ? ' is hidden' : ''),
          options: {
            label: ''
          },
          type: field.type || 'text',
        },
      }
    };
  });

  return (
    <form onSubmit={handleSubmit(doSubmit)} {...classes()}>
      {formFieldList.map((field, key) =>
        <div {...classes({ element: 'row', extra: 'row' })} key={key}>
          <div {...classes({ element: 'label', extra: 'col-xs-5' })}>
            {field.label}
            {field.isRequired &&
              <span {...classes({ element: 'required-mark' })}>*</span>
            }
          </div>
          <div {...classes({
            element: 'input',
            extra: 'col-xs-7',
            modifiers: { checkbox: field.type === 'checkbox' }
          })}>
            <Field
              component={Fieldset}
              name={field.name}
              InputComponent={field.InputComponent}
            />
          </div>
        </div>
      )}
      <div {...classes({ element: 'row', extra: 'row' })}>
        <div {...classes({ element: 'required-notification', extra: 'col-xs-12' })}>
          * Required information
        </div>
      </div>
      <div {...classes({ element: 'row', modifiers: 'actions' })}>
        <Button
          {...classes('btn')}
          type="submit"
          label={submitting ? 'Saving...' : 'Save'}
          mods={['success']}
          disabled={submitting}
        />
      </div>
    </form>
  );
}

export default DynamicDataForm;
