import * as React from 'react';
import {
  Button,
  LoadingPanel,
  Toolbar,
  Tabs,
  Pagination,
  Form,
  FormInput,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import Table from './components/Table';
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
      <div {...classes('table')}>
        <Table pendingOnly={pendingOnly} />
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

