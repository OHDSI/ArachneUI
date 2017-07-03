import * as React from 'react';
import {
  Button,
  LoadingPanel,
  Toolbar,
  Tabs,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import Table from './components/Table';
import ModalAddPermission from './components/ModalAddPermission';
import ModalEditPermissions from './components/ModalEditPermissions';

require('./style.scss');

interface ILicensesProps {
  openModal: any;
  load: () => (dispatch: Function) => any;
  isLoading: boolean;
  pendingOnly: boolean;
  filter: Function;
};

function Licenses(props: ILicensesProps) {
  const { isLoading, openModal, pendingOnly, filter } = props;
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

  return (
    <div {...classes()}>
      <Toolbar caption='Licenses'>
        <Tabs
          options={options}
          onChange={(val) => filter(val)}
          value={pendingOnly}
        />
        <Button {...classes('add-button')} onClick={openModal} mods={['submit', 'rounded']}>
          Add permission
        </Button>
      </Toolbar>
      <Table pendingOnly={pendingOnly} />
      <ModalAddPermission />
      <ModalEditPermissions />
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Licenses;

