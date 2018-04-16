/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
  const levels = parseInt(get(state, 'form.termFilters.value.levels', defaultLevels.toString()), 0);

  return {
    initialValues: termFilters,
    path,
    zoomLevel: termFilters.zoomLevel,
    levels,
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
      url.setSearch('levels', param.levels !== undefined
        ? param.levels
        : stateProps.levels);
      url.setSearch('zoomLevel', param.zoomLevel !== undefined
        ? param.zoomLevel
        : stateProps.zoomLevel);
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


