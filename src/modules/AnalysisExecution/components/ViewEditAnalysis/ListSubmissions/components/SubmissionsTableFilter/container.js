/*
  *
  * Copyright 2017 Observational Health Data Sciences and Informatics
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  * Company: Odysseus Data Services, Inc.
  * Product Owner/Architecture: Gregory Klebanov
  * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
  * Created: Monday, February 26, 2018 4:17 PM
  *
  */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import { reset, change } from 'redux-form';
import { ContainerBuilder, get, Utils } from 'services/Utils';
import { form, modal, submissionStatuses, paths, submissionFilters } from 'modules/AnalysisExecution/const';
import { ModalUtils } from 'arachne-ui-components';
import URI from 'urijs';
import difference from 'lodash/difference';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class SubmissionsTableFilter extends Component {
  static get propTypes() {
    return {
    };
  }

  componentWillReceiveProps(nextProps) {
    [submissionFilters.dataSourceIds.name, submissionFilters.submissionStatuses.name].forEach(
      (fieldName) => {
        const diff = difference(
          nextProps.selectedValues[fieldName],
          this.props.selectedValues[fieldName]
        );
        const newValue = get(diff, '[0]', null, 'String');
        if (newValue === '') {
          // any option selected
          this.props.flush(fieldName);
        }
      }
    );
  }

  render() {
    return presenter(this.props);
  }
}
 
export default class SubmissionsTableFilterBuilder extends ContainerBuilder {
  getComponent() {
    return SubmissionsTableFilter;
  }

  
  getFormParams() {
    return {
      form: form.submissionsTableFilter,
      enableReinitialize: true,
    };
  }
  
  getModalParams() {
    return {
      name: modal.submissionsTableFilter,
    };
  }

  mapStateToProps(state) {
    const dataSourceList = selectors.getDatasourceList(state);
    const statusList = submissionStatuses;
    const analysisId = get(state, 'analysisExecution.analysis.data.result.id');
    const initialValues = Utils.getFilterValues(
      get(state, 'routing.locationBeforeTransitions.search', '', 'String')
    );
    const selectedValues = get(state, `form.${form.submissionsTableFilter}.values.filter`, {}, 'Object');
    
    return {
      dataSourceList,
      statusList,
      analysisId,
      initialValues: {
        filter: initialValues,
      },
      selectedValues,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.submissionsTableFilter, false),
      redirect: (analysisId, params) => {
        if (!analysisId) {
          return false;
        }
        const url = new URI(paths.analyses(analysisId));
        const filteredParams = {
          filter: {},
        };
        if (params.filter) {
          Object.entries(params.filter)
            .forEach(([filter, values]) => {
              filteredParams.filter[filter] = Array.isArray(values) ? values.filter(val => val.length) : values;
            });
        }
        url.setSearch(filteredParams);
        url.setSearch('page', '1');
        return actions.router.goToPage(url.href());
      },
      reset: () => reset(form.submissionsTableFilter),
      flush: field => change(form.submissionsTableFilter, `filter[${field}]`, []),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        dispatchProps.redirect(stateProps.analysisId, data);
        dispatchProps.closeModal();
      },
      doClear() {
        dispatchProps.reset();
        dispatchProps.redirect(stateProps.analysisId, {});
        dispatchProps.closeModal();
      },
    };
  }
}
