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
 * Created: January 31, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Form,
  FormSelect,
  FormInput,
  Panel,
  FormTextarea,
} from 'arachne-ui-components';
import { fieldTypes } from 'modules/ExpertFinder/const';
import { immutableAttributes, fieldHints } from 'const/dataSource';

require('./style.scss');

function ImmutableAttribute({ name, value }) {
  const classes = new BEMHelper('immutable-attribute');

  return (
    <div {...classes()}>
      <div {...classes('value')}>{value}</div>
      {fieldHints[name] &&
        <div
          {...classes('hint', null, 'ac-tooltip')}
          aria-label={fieldHints[name]}
          data-tootik-conf={'bottom multiline'}
        >help</div>
      }
    </div>
  );
}

export function AttributesFormListItem({ item, input, meta, isWide = false }) {
  const itemClasses = new BEMHelper('attributes-form-list-item');
  let field = null;
  if (immutableAttributes.includes(item.name)) {
    field = (<ImmutableAttribute name={item.name} value={input.value} />);
  } else {
    switch (item.type) {
      case fieldTypes.enum:
        case fieldTypes.enumMulti:
        field = (<FormSelect
          options={item.options}
          mods={['bordered']}
          input={input}
          meta={meta}
          isMulti={item.type === fieldTypes.enumMulti}
        />);
        break;
      case fieldTypes.string:
      case fieldTypes.integer:
        field = (
          <FormInput
            placeholder={item.label}
            mods={['bordered']}
            input={input}
            meta={meta}
          />
        );
        break;
      case fieldTypes.textarea:
        field = (
          <FormTextarea
            placeholder={item.label}
            mods={['bordered']}
            input={input}
            meta={meta}
          />
        );
        break;
      default:
        return null;
    }
  }

  return (
    <div {...itemClasses({ modifiers: { wide: isWide } })}>
      <div {...itemClasses('name', { wide: isWide })}>
        {item.label} {item.isRequired && <span {...itemClasses('required')}>*</span>}
      </div>
      <div {...itemClasses('value', { wide: isWide })}>
        {field}
      </div>
    </div>
  );
}

function AttributesList(props) {
  const classes = new BEMHelper('attributes-form-list');
  const {
    attrList,
    initialValues,
    doSubmit,
    isPublished,
  } = props;
  const fields = attrList
    .map(item => ({
      name: item.name,
      InputComponent: {
        component: AttributesFormListItem,
        props: {
          item,
        },
      },
    }));
  const submitBtn = {
    label: isPublished ? 'Save' : 'Publish',
    mods: ['success', 'rounded'],
  };

  return (
    <Panel {...classes()} title="Metadata">
      <Form
        {...props}
        onSubmit={doSubmit}
        fields={fields}
        mods={['no-spacing', 'actions-inline']}
        submitBtn={submitBtn}
      />
    </Panel>
  );
}

export default AttributesList;
