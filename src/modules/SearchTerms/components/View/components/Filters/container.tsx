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
};

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IFiltersPanelStateProps {
  const termFilters = getTermFilters(state);
  const path = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    search: '',
  });

  return {
    initialValues: termFilters,
    path,
  };
}

const mapDispatchToProps = {
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
      const url = new URI(stateProps.path.pathname  + stateProps.path.search);
      url.setSearch('levels', param.levels);
      return dispatchProps.filter(url.href());
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


