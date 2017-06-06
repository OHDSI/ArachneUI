import { connect } from "react-redux";
import { Component } from "react";
import presenter, { IFiltersPanelDispatchProps, IFiltersPanelProps, IFiltersPanelStateProps } from "./presenter";
import { reduxForm } from "redux-form";
import { forms, paths } from "modules/SearchTerms/const";
import actions from "modules/SearchTerms/actions";
import { push as goToPage } from "react-router-redux";
import * as URI from "urijs";
import { getTermFilters } from "modules/SearchTerms/selectors";

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: any): IFiltersPanelStateProps {
  const termFilters = getTermFilters(state);

  return {
    initialValues: termFilters,
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
      const address = new URI(paths.term(ownProps.termId));
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


