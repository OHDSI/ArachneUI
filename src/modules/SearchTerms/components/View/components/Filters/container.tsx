import { connect } from "react-redux";
import { Component } from "react";
import presenter, { IFiltersPanelDispatchProps, IFiltersPanelProps, IFiltersPanelStateProps } from "./presenter";
import { reduxForm } from "redux-form";
import { forms, paths, defaultLevels, defaultStandardsOnly } from "modules/SearchTerms/const";
import actions from "modules/SearchTerms/actions";
import { push as goToPage } from "react-router-redux";
import * as URI from "urijs";
import { getTermFilters } from "modules/SearchTerms/selectors";
import { get } from 'lodash';

interface IFiltersOwnProps {
  termId: number;
  isTableMode: boolean;
};

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: IFiltersOwnProps): IFiltersPanelStateProps {
  const termFilters = getTermFilters(state);
  const levels = get(state, 'form.termFilters.values.levels', defaultLevels);
  const standardsOnly = get(state, 'form.termFilters.values.standardsOnly', defaultStandardsOnly);
  const currentValues = {
    levels,
    standardsOnly,
  };

  return {
    initialValues: termFilters,
    currentValues,
  };
}

const mapDispatchToProps = {
  fetchConceptAncestors: actions.termList.fetchConceptAncestors,
  fetchRelationships: actions.termList.fetchRelationships,
  filter: (address: string) => goToPage(address),
};

function mergeProps(stateProps: IFiltersPanelStateProps,
                    dispatchProps: IFiltersPanelDispatchProps,
                    ownProps: IFiltersOwnProps): IFiltersPanelProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doFilter: (param) => {
      const address = new URI(paths.term(ownProps.termId, ownProps.isTableMode));
      address.search({
        ...stateProps.currentValues,
        ...param,
      });
      return dispatchProps.filter(address.href());
    },
  };
}

const FormFilters = reduxForm({
  form: forms.termFilters
})(TermFilterPanel);

export default connect<IFiltersPanelStateProps, IFiltersPanelDispatchProps, IFiltersOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(FormFilters);


