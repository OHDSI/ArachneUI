import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Admin/const';
import presenter from './presenter';
import selectors from './selectors';

import { License } from 'modules/Admin/components/Licenses/types';
interface IListStateProps {	
	licenses: Array<License>;
};
interface IListDispatchProps {
	openEditModal: (data: Object) => (dispatch: Function) => any;
	remove: (id: number) => (dispatch: Function) => any;
	loadLicenses: () => (dispatch: Function) => any;
	removeAll: (license: License) => void;
};
interface IListProps extends IListStateProps, IListDispatchProps {
};

class LicensesList extends Component<IListProps, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IListStateProps {
	let licenses = selectors.getLicenses(state);

	return {
		licenses,
	};
}

const mapDispatchToProps = {
	openEditModal: data => ModalUtils.actions.toggle(modal.editPermission, true, data),
  remove: actions.licenses.remove,
  loadLicenses: actions.licenses.load,
};

function mergeProps(
  stateProps: IListStateProps,
  dispatchProps: IListDispatchProps,
  ownProps
  ) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    removeAll: ({ user, vocabularies }) => {
    	if (!confirm(`Remove all permissions for ${user.name}?`)) {
    		return;
    	}
      const promises = [];
      vocabularies.forEach((vocab) => {
        promises.push(dispatchProps.remove(vocab.licenseId));
      });
      const promise = Promise.all(promises);
      promise
        .then(() => dispatchProps.loadLicenses())
        .catch(() => {});
    },
  };
}

export default connect<IListStateProps, IListDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(LicensesList);
