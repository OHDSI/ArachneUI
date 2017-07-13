import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { modal, paths, pageSize, forms } from 'modules/Admin/const';
import { push } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import { debounce } from 'lodash';
import presenter from './presenter';

interface ILicensesStateProps {
	isLoading: boolean;
	pendingOnly: boolean;
	page: number;
	pages: number;
	path: string;
	username: string;
};
interface ILicensesDispatchProps {
	load: (page: number, pageSize: number, username?: string) => (dispatch: Function) => any;
	openModal: () => (dispatch: Function) => any;
	goToPage: (address: string) => (dispatch: Function) => any;
};
interface ILicensesProps extends ILicensesStateProps, ILicensesDispatchProps {
	isLoading: boolean;
	filter: Function;
};

class Licenses extends Component<ILicensesProps, void> {
	private filterByName;

	constructor() {
		super();
		this.filterByName = debounce(this.doFilter.bind(this), 500);
	}

	componentWillMount() {
		this.props.load(this.props.page, pageSize);
	}

	componentWillReceiveProps(nextProps: ILicensesStateProps) {
		if (this.props.username !== nextProps.username) {
			this.filterByName();
		}
	}

	doFilter() {
		this.props.load(1, pageSize, this.props.username);
		// go to first page
		this.props.filter(this.props.pendingOnly);
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object, ownProps: any): ILicensesStateProps {
	const pendingOnly = get(ownProps, 'routeParams.pending') === 'pending';
	const page = parseInt(get(state, 'routing.locationBeforeTransitions.query.page', '1'), 0);
	const pages = get(state, 'admin.licenses.queryResult.totalPages', 0);
	const path = get(state, 'routing.locationBeforeTransitions', {
    pathname: paths.licenses(pendingOnly),
    search: '',
  });
  const username = get(state, 'form.licenseFilter.values.username', '');

	return {
		isLoading: get(state, 'vocabulary.vocabularies.isLoading', false),
		pendingOnly,
		page,
		pages,
		path: path.pathname + path.search,
		username,
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

const FormLicenses = reduxForm({
	form: forms.licenseFilter,
})(Licenses);

export default connect<ILicensesStateProps, ILicensesDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(FormLicenses);
