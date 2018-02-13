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
 * Created: April 21, 2017
 *
 */

import React from 'react';
import {
  LoadingPanel,
  Form,
  FormInput,
  FormTextarea,
  Panel,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { AttributesFormListItem } from '../AttributesList/presenter';

import './style.scss';
import { fieldTypes } from 'modules/ExpertFinder/const';

function FormCreateDataNode(props) {
  const classes = new BEMHelper('data-node-list-form-create');

  const {
    isLoading,
  } = props;

  const submitBtn = {
    label: 'Create',
    loadingLabel: 'Creating...',
  };

  const fields = [
    {
      name: 'name',
      InputComponent: {
        component: AttributesFormListItem,
        props: {
          item: {
            name: '',
            label: 'Name of data node',
            type: fieldTypes.string,
          },
        },
      },
    },
    {
      name: 'description',
      InputComponent: {
        component: AttributesFormListItem,
        props: {
          item: {
            label: 'Description',
            type: fieldTypes.textarea,
          },
          isWide: true,
        },
      },
    },
  ];

  return (
    <Panel title={'Create Data Node'} {...classes()}>
      <Form
        fields={fields}
        submitBtn={submitBtn}
        mods={['no-spacing', 'actions-inline']}
        onSubmit={props.doSubmit}
        {...props}
      />
      <LoadingPanel active={isLoading} />
    </Panel>
  );
}

export default FormCreateDataNode;
