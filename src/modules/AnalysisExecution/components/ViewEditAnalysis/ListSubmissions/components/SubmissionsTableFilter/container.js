/*
  *
  * Copyright 2018 Observational Health Data Sciences and Informatics
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
import isEmpty from 'lodash/isEmpty';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class SubmissionsTableFilter extends Component {
  static get propTypes() {
    return {
    };
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
    const dataSourceIds = selectors.getDatasourceList(state);
    const analysisId = get(state, 'analysisExecution.analysis.data.result.id');
    const initialValues = Utils.getFilterValues(
      get(state, 'routing.locationBeforeTransitions.search', '', 'String')
    );
    const selectedValues = get(state, `form.${form.submissionsTableFilter}.values.filter`, {}, 'Object');
    const fieldValues = {
      dataSourceIds,
      submissionStatuses,
    };
    ['dataSourceIds', 'submissionStatuses'].forEach((fieldName) => {
      const value = initialValues[fieldName];
      if (isEmpty(value)) {
        initialValues[fieldName] = fieldValues[fieldName].map(option => option.value);
      }
    });
    const isAnyDatasourceId = get(selectedValues, 'dataSourceIds.length', 0, 'Number') === dataSourceIds.length;
    const isAnySubmissionStatus = get(selectedValues, 'submissionStatuses.length', 0, 'Number') === submissionStatuses.length;

    return {
      fieldValues,
      analysisId,
      initialValues: {
        filter: initialValues,
      },
      selectedValues,
      isAnyDatasourceId,
      isAnySubmissionStatus,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.submissionsTableFilter, false),
      redirect: (analysisId, params, canonicalValues) => {
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
              if (Array.isArray(values)) {
                // checkbox list
                if (values.length === canonicalValues[filter].length) {
                  // checked all values
                  return false;
                }
              }
              filteredParams.filter[filter] = Array.isArray(values)
                ? values.filter(val => val.length)
                : values;
            });
        }
        url.setSearch(filteredParams);
        url.setSearch('page', '1');
        return actions.router.goToPage(url.href());
      },
      reset: () => reset(form.submissionsTableFilter),
      selectAll: (field, values) =>
        change(form.submissionsTableFilter, `filter[${field}]`, values),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        dispatchProps.redirect(stateProps.analysisId, data, stateProps.fieldValues);
        dispatchProps.closeModal();
      },
      doClear() {
        dispatchProps.reset();
        dispatchProps.redirect(stateProps.analysisId, {});
        dispatchProps.closeModal();
      },
      checkAll(fieldName) {
        dispatchProps.selectAll(
          fieldName,
          stateProps.fieldValues[fieldName].map(option => option.value)
        );
      },
      uncheckAll(fieldName) {
        dispatchProps.selectAll(
          fieldName,
          []
        );
      },
    };
  }
}
