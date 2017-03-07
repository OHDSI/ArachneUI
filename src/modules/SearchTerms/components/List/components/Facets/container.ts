import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { forms } from 'modules/SearchTerms/const';
import presenter from './presenter';
import selectors from './selectors';

import { IFacetProps, IFacets } from './presenter';

class Facets extends Component<IFacetProps, void> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IFacetProps {
	const facets = selectors.getFacets(state);

  return {
  	facets,
  };
}

const mapDispatchToProps = {};

function mergeProps(stateProps: IFacetProps, dispatchProps: Object, ownProps: Object): IFacets {
  return {
    facets: stateProps.facets,
  };

}

const FormFacets = reduxForm({
  form: forms.filter,
})(Facets);

export default connect<IFacetProps, Object, {}>(mapStateToProps, mapDispatchToProps, mergeProps)(FormFacets);
