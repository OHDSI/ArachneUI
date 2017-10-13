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
 * Created: January 16, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { FormExpansible } from 'arachne-ui-components';
import { FormDatepicker } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import { FormTextarea } from 'arachne-ui-components';
import Publication from './Publication';
import { Panel } from 'arachne-ui-components';
import { submitBtnConfig, cancelBtnConfig } from 'modules/ExpertFinder/const';

require('./style.scss');

function Publications(props) {
  const { items, editable } = props;
  const classes = new BEMHelper('profile-publications');
  const formFields = [
    {
      name: 'title',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Title',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'publisher',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Publication/Publisher',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'date',
      InputComponent: {
        component: FormDatepicker,
        props: {
          placeholder: 'Publication Date',
          required: true,
          type: 'text',
          options: {
            selected: props.selectedDate,
          },
        },
      },
    },
    /*{
      name: 'author',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Author',
          required: true,
          type: 'text',
        },
      },
    },*/
    {
      name: 'url',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Publication Link',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'description',
      InputComponent: {
        component: FormTextarea,
        props: {
          placeholder: 'Description',
          required: true,
          type: 'text',
          mods: 'no-border'
        },
      },
    },
  ];

  return (
    <Panel title="Publications" {...classes()}>
      <div {...classes({ element: 'content', modifiers: { empty: !items.length } })}>
        {!items.length &&
          <span>No publications yet</span>
        }
        {items.map((record, key) =>
          <Publication
          {...record}
          key={key}
          onRemove={props.doRemove}
          editable={props.editable}
        />
        )}
      </div>
      {editable && 
        <FormExpansible
          fields={formFields}
          addButtonTitle="Add publication"
          formTitle="Add publication"
          onSubmit={props.doSubmit}
          submitBtnConfig={submitBtnConfig}
          cancelBtnConfig={cancelBtnConfig}
          {...props}
        />
      }
    </Panel>
  );
}

Publications.PropTypes = {
  editable: PropTypes.bool,
  items: PropTypes.array.isRequired,
};
export default Publications;
