import * as React from 'react';
import {
  Button,
  LoadingPanel,
  Toolbar,
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
};


function Licenses(props: ILicensesProps) {
  const { isLoading, openModal } = props;
  const classes = BEMHelper('licenses');

  return (
    <div {...classes()}>
      <Toolbar caption='Licenses'>      
        <Button {...classes('add-button')} onClick={openModal} mods={['submit', 'rounded']}>
          Add permission
        </Button>
      </Toolbar>
      <Table />
      <ModalAddPermission />
      <ModalEditPermissions />
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Licenses;

