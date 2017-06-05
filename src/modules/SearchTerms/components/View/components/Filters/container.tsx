import { connect } from 'react-redux';
import { Component } from 'react';
import presenter from './presenter';
import { IFiltersPanelProps, IFiltersPanelDispatchProps, IFiltersPanelStateProps } from './presenter';
import { reduxForm } from 'redux-form';
import { forms } from 'modules/SearchTerms/const';
import actions from 'modules/SearchTerms/actions';
import { get, extend } from 'lodash';

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: any): IFiltersPanelStateProps {
  const filterParams = get(state, 'searchTerms.termFilters.data') || {levels: 10, standardsOnly: false};
  console.log('Filters/container', state, filterParams);

  return {
    initialValues: filterParams,
  };
}

const mapDispatchToProps = {
  fetchRelations: actions.termList.fetchRelations,
  fetchRelationships: actions.termList.fetchRelationships,
  setTermFilters: actions.termList.setTermFilters,
};

function mergeProps(stateProps: IFiltersPanelStateProps,
                    dispatchProps: IFiltersPanelDispatchProps,
                    ownProps: { termId: number }): IFiltersPanelProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doFilter: function (data) {
      console.log('TermFilters.doFilter', data, ownProps);
      dispatchProps.setTermFilters(data);
      // dispatchProps.fetchRelations(ownProps.termId, data.levels);
      // dispatchProps.fetchRelationships(ownProps.termId, data.standardsOnly);
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


