import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/Admin/const';
import presenter from './presenter';

interface ILicensesStateProps {};
interface ILicensesDispatchProps {
	load: () => (dispatch: Function) => {};
	openModal: () => {};
};
interface ILicensesProps extends ILicensesStateProps, ILicensesDispatchProps {
	isLoading: boolean;
};

class Licenses extends Component<ILicensesProps, void> {
	componentWillMount() {
		this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): ILicensesStateProps {

	return {
		isLoading: get(state, 'vocabulary.vocabularies.isLoading', false),
	};
}

const mapDispatchToProps = {
	load: actions.licenses.load,
	openModal: () => ModalUtils.actions.toggle(modal.addPermission, true),
};

export default connect<ILicensesStateProps, ILicensesDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps
)(Licenses);
