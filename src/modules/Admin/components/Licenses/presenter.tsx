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
import {
  Button,
  LoadingPanel,
  Toolbar,
  Tabs,
  Pagination,
  Form,
  FormInput,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import LicensesList from './components/LicensesList';
import ModalAddPermission from './components/ModalAddPermission';
import ModalEditPermissions from './components/ModalEditPermissions';

require('./style.scss');

interface ILicensesProps {
  openModal: any;
  load: (page: number, pageSize: number) => (dispatch: Function) => any;
  isLoading: boolean;
  pendingOnly: boolean;
  filter: Function;
  page: number;
  pages: number;
  path: string;
};

function Licenses(props: ILicensesProps) {
  const { isLoading, openModal, pendingOnly, filter, page, pages, path } = props;
  const classes = BEMHelper('licenses');
  const options = [
    {
      label: 'All',
      value: false,
    },
    {
      label: 'Pending',
      value: true,
    },
  ];
  const fields = [
    {
      name: 'username',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Filter by name',
        },
      },
    }
  ];

  return (
    <div {...classes()}>
      <div {...classes('toolbar')}>
        <Toolbar caption='Licenses'>
          <Form
            {...props}
            fields={fields}
            onSubmit={() => {}}
          />
          <Tabs
            options={options}
            onChange={(val) => filter(val)}
            value={pendingOnly}
          />
          <Button {...classes('add-button')} onClick={openModal} mods={['submit', 'rounded']}>
            Add permission
          </Button>
        </Toolbar>
      </div>
      <div {...classes('table')}>
        <LicensesList />
      </div>
      <div {...classes('pagination')}>
        <Pagination currentPage={page} pages={pages} path={path} />
      </div>
      <ModalAddPermission />
      <ModalEditPermissions />
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Licenses;

