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

import { Component } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import { forms } from 'modules/SearchTerms/const';
import * as URI from 'urijs';
import { get } from 'lodash';
import actions from 'modules/SearchTerms/actions';
import presenter from './presenter';

import { IToolbarProps, IToolbarStateProps, IToolbarDispatchProps } from './presenter';

class Toolbar extends Component<IToolbarProps, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IToolbarStateProps {
  const locationSearch = get(state, 'routing.locationBeforeTransitions', {
  	pathname: '',
  	search: '',
  	query: {
  		query: '',
  	},
  });
  const filterParams = get(state, 'form.filter.values.filter', { page: 0, pageSize: 1 });

  return {
  	initialValues: {
  		searchString: get(locationSearch, 'query.query') || '',
  	},
  	locationSearch,
    filterParams,
  };
}

const mapDispatchToProps = {
  search: (address: string) => goToPage(address),
};

function mergeProps(
		stateProps: IToolbarStateProps,
		dispatchProps: IToolbarDispatchProps,
		ownProps: Object
	): IToolbarProps {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		filter: (data: { searchString: string }) => {
		  const currentAddress = new URI(`${stateProps.locationSearch.pathname}${stateProps.locationSearch.search}`);
		  currentAddress.setSearch('query', data.searchString);
			currentAddress.setSearch('page', 1);
		  const search = currentAddress.href();
		  dispatchProps.search(search);
		  const filterParams = {
			...stateProps.filterParams,
			query: data.searchString,
		  };

		},
	};
}

const FormToolbar = reduxForm({
  form: forms.toolbar,
  enableReinitialize: true,
})(Toolbar);

export default connect
<IToolbarStateProps, IToolbarDispatchProps, {}>
(mapStateToProps, mapDispatchToProps, mergeProps)
(FormToolbar);
