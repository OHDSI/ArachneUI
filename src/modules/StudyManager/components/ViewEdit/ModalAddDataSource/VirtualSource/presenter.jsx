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
 * Created: June 23, 2017
 *
 */

import React from "react";
import { Avatar, Form, FormInput, FormAutocomplete, Link } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { apiPaths, paths } from 'modules/StudyManager/const';

require('./style.scss');

function Owner({ removeOwner, user }) {
  const classes = new BEMHelper('study-vds-owner');

  return (
    <li {...classes()}>
      <span {...classes('avatar')}>
        <Avatar
          mods={['round']}
          img={apiPaths.userpic(user.id)}
        />
      </span>
      <span {...classes('name')}>
        <Link to={paths.user(user.id)}>
          {user.fullName}
        </Link>
      </span>
      {user.isRemovable &&
        <i
          {...classes('remove-ico')}
          onClick={() => removeOwner(user)}
        >
          close
        </i>
      }
    </li>
  );
}

function OwnerList({ removeOwner, /* redux */ input }) {
  const classes = new BEMHelper('study-vds-owner-list');

  const isEmptyList = !(input.value && input.value.length);
  let component = null;

  if (input.value && input.value.length) {
    component = (
      <div {...classes()}>
        <label {...classes('label')}>
          Data owners
        </label>
        <ul {...classes('user-list')}>
          {input.value.map(user =>
            <Owner user={user} removeOwner={removeOwner} />
          )}
        </ul>
      </div>
    );
  }

  return component;
}

function VirtualSource(props) {
  const classes = new BEMHelper('study-form-add-virtual-ds');

  const fields = [
    {
      name: 'name',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name Data source',
          type: 'text',
        }
      }
    },
    {
      name: 'ownerSelector',
      InputComponent: {
        component: FormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Add Data Owner',
          options: props.ownerOptions,
          fetchOptions: () => {},
          clearable: false,
        }
      }
    },
    {
      name: 'ownerList',
      InputComponent: {
        component: OwnerList,
        props: {
          removeOwner: props.removeOwner,
        }
      }
    }
  ];

  const submitBtn = {
    label: props.dataSourceId ? 'Update Data source' : 'Add Data source',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
    <div {...classes()}>
      <Form
        mods="spacing-actions-sm"
        fields={fields}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        onSubmit={props.doSubmit}
        onCancel={props.closeModal}
        {...props}
      />
    </div>
  );
}

export default VirtualSource;
