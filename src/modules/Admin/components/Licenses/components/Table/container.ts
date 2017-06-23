import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/Admin/const';
import presenter from './presenter';
import selectors from './selectors';

interface IListStateProps {};
interface IListDispatchProps {};
interface IListProps extends IListStateProps, IListDispatchProps {
	licenses: Array<any>;
};

class LicensesList extends Component<IListProps, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IListStateProps {
	const licenses = selectors.getLicenses(state);

	return {
		licenses,
	};
}

const mapDispatchToProps = {
	openEditModal: data => ModalUtils.actions.toggle(modal.editPermission, true, data),
  remove: actions.licenses.remove,
};

export default connect<IListStateProps, IListDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(LicensesList);
