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
  updateFacets: actions.facets.updateFacets,
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
		  const search = currentAddress.href();
		  dispatchProps.search(search);
		  const filterParams = {
			...stateProps.filterParams,
			query: data.searchString,
		  };

		  dispatchProps.updateFacets(filterParams);
		},
	};
}

const FormToolbar = reduxForm({
  form: forms.toolbar,
})(Toolbar);

export default connect
<IToolbarStateProps, IToolbarDispatchProps, {}>
(mapStateToProps, mapDispatchToProps, mergeProps)
(FormToolbar);
