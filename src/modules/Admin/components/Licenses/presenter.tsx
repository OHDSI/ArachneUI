import * as React from 'react';
import {
  LoadingPanel,
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
      <Table />
      <div {...classes('add')} onClick={openModal}>
        <span {...classes('add-icon')}>add_circle_outline</span>
        <span {...classes('add-label')}>Add permission</span>
      </div>
      <ModalAddPermission />
      <ModalEditPermissions />
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Licenses;

