import { connect } from 'react-redux';
import { Component } from 'react';
import presenter from './presenter';
import { IFiltersPanelProps, IFiltersPanelDispatchProps, IFiltersPanelStateProps } from './presenter';
import { reduxForm } from 'redux-form';
import { forms } from 'modules/SearchTerms/const';
import actions from 'modules/SearchTerms/actions';
import { get, has } from 'lodash';
import { push as goToPage } from 'react-router-redux';
import * as URI from 'urijs';

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: any): IFiltersPanelStateProps {
  const location = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    query: null,
  });
  const filterParams = {
    levels: has(location.query, 'levels') ? location.query.levels : 10,
    standardsOnly: has(location.query, 'standardsOnly') ? location.query.standardsOnly === 'true' : false,
  };

  return {
    initialValues: filterParams,
    location: location,
  };
}

const mapDispatchToProps = {
  fetchConceptAncestors: actions.termList.fetchConceptAncestors,
  fetchRelationships: actions.termList.fetchRelationships,
  filter: (address: string) => goToPage(address),
};

function mergeProps(stateProps: IFiltersPanelStateProps,
                    dispatchProps: IFiltersPanelDispatchProps,
                    ownProps: { termId: number }): IFiltersPanelProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doFilter: function (data) {
      const address = new URI(`${stateProps.location.pathname}`);
      address.search(data);
      dispatchProps.filter(address.href());
    }
  };
}

const FormFilters = reduxForm({
  form: forms.termFilters
})(TermFilterPanel);

export default connect<IFiltersPanelStateProps, IFiltersPanelDispatchProps, {termId: number}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(FormFilters);


