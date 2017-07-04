import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { modal, paths } from 'modules/Admin/const';
import { push } from 'react-router-redux';
import presenter from './presenter';

interface ILicensesStateProps {
	isLoading: boolean;
	pendingOnly: boolean;
};
interface ILicensesDispatchProps {
	load: () => (dispatch: Function) => any;
	openModal: () => (dispatch: Function) => any;
	goToPage: (address: string) => (dispatch: Function) => any;
};
interface ILicensesProps extends ILicensesStateProps, ILicensesDispatchProps {
	isLoading: boolean;
	filter: Function;
};

class Licenses extends Component<ILicensesProps, void> {
	componentWillMount() {
		this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object, ownProps: any): ILicensesStateProps {
	const pendingOnly = get(ownProps, 'routeParams.pending') === 'pending';

	return {
		isLoading: get(state, 'vocabulary.vocabularies.isLoading', false),
		pendingOnly,
	};
}

const mapDispatchToProps = {
	load: actions.licenses.load,
	openModal: () => ModalUtils.actions.toggle(modal.addPermission, true),
	goToPage: (address: string) => push(address),
};

function mergeProps(
  stateProps: ILicensesStateProps,
  dispatchProps: ILicensesDispatchProps,
  ownProps
  ) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    filter: (pendingOnly: boolean) => dispatchProps.goToPage(paths.licenses(pendingOnly)),
  };
}

export default connect<ILicensesStateProps, ILicensesDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Licenses);
