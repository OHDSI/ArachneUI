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
 * Created: December 28, 2016
 *
 */

import React from 'react';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Fieldset,
  FormInput,
  FormSelect,
  Panel,
} from 'arachne-ui-components';
import { types as metadataTypes } from 'const/modelAttributes';

require('./style.scss');

function BusinessData(props) {
  const formClasses = new BEMHelper('cdm-data-source-form');

  const {
    backUrl,
    isRegistered,
    attrList,
		doSubmit,
    unregisterAtCentral,
  	// redux-form props
  	error,
    handleSubmit,
    submitting,
  } = props;

  const fieldList = attrList.map((attr) => {
    const field = { ...attr };

    switch (attr.type) {
      case metadataTypes.integer:
        field.InputComponent = {
          component: FormInput,
          props: {
            mods: ['bordered'],
            placeholder: field.label,
            type: 'number',
          },
        };
        break;
      case metadataTypes.enum:
        field.InputComponent = {
          component: FormSelect,
          props: {
            mods: ['bordered'],
            placeholder: field.label,
            options: field.options,
          },
        };
        break;
      case metadataTypes.enumMulti:
        field.InputComponent = {
          component: FormSelect,
          props: {
            mods: ['bordered'],
            isMulti: true,
            placeholder: field.label,
            options: field.options,
          },
        };
        break;
      case metadataTypes.string:
      default:
        field.InputComponent = {
          component: FormInput,
          props: {
            mods: ['bordered'],
            placeholder: field.label,
            type: 'text',
          },
        };
        break;
    }

    if (field.disabled === true) {
      field.InputComponent.props.mods.push("disabled");
      field.InputComponent.props.disabled = true;
    }

    return field;
  });

  return (
    <Panel title="Business data">
      <form onSubmit={handleSubmit(doSubmit)} {...formClasses()}>
        {fieldList.map((field, key) =>
          <div {...formClasses({ element: 'row', extra: 'row' })} key={key}>
            <div {...formClasses({ element: 'label', extra: 'col-xs-5' })}>
              {field.label}
              {field.isRequired &&
                <span {...formClasses({ element: 'required-mark' })}>*</span>
              }
            </div>
            <div {...formClasses({ element: 'input', extra: 'col-xs-7' })}>
              <Field
                component={Fieldset}
                name={field.name}
                InputComponent={field.InputComponent}
              />
            </div>
          </div>
        )}
        <div {...formClasses({ element: 'row', extra: 'row' })}>
          <div {...formClasses({ element: 'required-notification', extra: 'col-xs-12' })}>
            * Required information
          </div>
        </div>
        <div {...formClasses({ element: 'row', modifiers: 'actions' })}>
          {isRegistered &&
            <Button
              {...formClasses('btn', 'unregister')}
              mods={['cancel', 'rounded']}
              onClick={unregisterAtCentral}
              label='unregister'
            />
          }
          {isRegistered ?
            <Button
              {...formClasses('btn')}
              type="submit"
              label={submitting ? 'Saving...' : 'Save'}
              mods={['success', 'rounded']}
              disabled={submitting}
            />
            :
            <Button
              {...formClasses('btn')}
              type="submit"
              label={submitting ? 'Registering...' : 'Register'}
              mods={['submit', 'rounded']}
              disabled={submitting}
            />            
          }
          <Button
            {...formClasses('btn')}
            label="Cancel"
            link={backUrl}
            mods={['cancel', 'rounded']}
            disabled={submitting}
          />
        </div>
      </form>
    </Panel>
  );
}

export default BusinessData;
