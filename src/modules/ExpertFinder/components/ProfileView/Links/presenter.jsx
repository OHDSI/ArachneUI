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
 * Created: January 16, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { FormExpansible } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import LinkListItem from './LinkListItem';
import { Panel } from 'arachne-ui-components';
import { submitBtnConfig, cancelBtnConfig } from 'modules/ExpertFinder/const';

require('./style.scss');

function Links(props) {
  const { items, editable } = props;
  const classes = new BEMHelper('profile-links');
  const formFields = [
    {
      name: 'title',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Name of Link',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'url',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Link',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'description',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Description',
          type: 'text',
        },
      },
    },
  ];

  return (
    <Panel title="Links" {...classes()}>
      <div {...classes({ element: 'content', modifiers: { empty: !items.length } })}>      
        {!items.length &&
          <span>No links yet</span>
        }
        {items.map((record, key) =>
          <LinkListItem
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
          addButtonTitle="Add Link"
          formTitle="Add Link"
          onSubmit={ props.doSubmit }
          submitBtnConfig={submitBtnConfig}
          cancelBtnConfig={cancelBtnConfig}
          {...props}
        />
     }
    </Panel>
  );
}

Links.PropTypes = {
  editable: PropTypes.bool,
  items: PropTypes.array.isRequired,
};
export default Links;
