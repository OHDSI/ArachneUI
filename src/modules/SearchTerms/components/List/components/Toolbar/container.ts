import { Component } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import { forms } from 'modules/SearchTerms/const';
import * as URI from 'urijs';
import { get } from 'lodash';
import presenter from './presenter';

import { IToolbarProps, IToolbarStateProps } from './presenter';

class Toolbar extends Component<IToolbarProps, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IToolbarStateProps {
  const search = get(state, 'routing.locationBeforeTransitions');

  return {
  	initialValues: {
  		searchString: get(search, 'query.query') || '',
  	},
  	search,
  };
}

const mapDispatchToProps = {
  search: (address: string) => goToPage(address),
};

function mergeProps(stateProps: IToolbarStateProps, dispatchProps: Object, ownProps: Object): IToolbarProps {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		filter: (data: { searchString: string }) => {
			const currentAddress = new URI(`${stateProps.search.pathname}${stateProps.search.search}`);
      currentAddress.setSearch('query', data.searchString);
      dispatchProps.search(currentAddress.resource());
		},
	};
}

const FormToolbar = reduxForm({
  form: forms.toolbar,
})(Toolbar);

export default connect
<IToolbarStateProps, {}, {}>
(mapStateToProps, mapDispatchToProps, mergeProps)
(FormToolbar);
