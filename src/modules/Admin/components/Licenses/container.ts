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

import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Admin/actions';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-ui-components';
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
	load: (page: number, pageSize: number, username?: string, pendindOnly?: boolean) =>
		(dispatch: Function) => any;
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
		this.props.load(this.props.page, pageSize, this.props.username, this.props.pendingOnly);
	}

	componentWillReceiveProps(nextProps: ILicensesStateProps) {
		if (this.props.pendingOnly !== nextProps.pendingOnly || this.props.page !== nextProps.page) {
			this.props.load(nextProps.page, pageSize, this.props.username, nextProps.pendingOnly);
		}
		if (this.props.username !== nextProps.username) {
			this.filterByName(nextProps.username);
		}
	}

	doFilter(name: string) {
		this.props.load(1, pageSize, name, this.props.pendingOnly);
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
