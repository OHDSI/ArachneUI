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
 * Created: September 29, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { Utils, get, ContainerBuilder } from 'services/Utils';
import isEqual from 'lodash/isEqual';
import { reduxForm, reset } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import qs from 'qs';
import FilterPresenter from './presenter';
import actions from 'actions';

/** @augments { Component<any, any> } */
class Filter extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.dirty && (!isEqual(nextProps.selectedFilters, this.props.selectedFilters) || nextProps.selectedQuery !== this.props.selectedQuery)) {
      const valuesToUnsearch = {};
      Object.keys(nextProps.selectedFilters).forEach((setting) => {
        if (!nextProps.selectedFilters[setting]) {
          valuesToUnsearch[setting] = undefined;
        }
      });

      let searchParams = {
        filter: {
          ...nextProps.selectedFilters,
          ...valuesToUnsearch,
        },
        query: nextProps.selectedQuery,
        page: 1,
      };

      if (typeof nextProps.queryEncode === 'function') {
        searchParams = nextProps.queryEncode({
          searchParams,
          filterFields: nextProps.fields,
        });
      }

      this.props.setSearch(searchParams);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (!isEqual(this.props.fields, nextProps.fields) ||
      !isEqual(nextProps.selectedFilters, this.props.selectedFilters) || 
      nextProps.selectedQuery !== this.props.selectedQuery);
  }

  render() {
    return FilterPresenter(this.props);
  }
}

export default class FilterBuilder extends ContainerBuilder {

  constructor({ formName }) {
    super();
    this.formName = formName;
    this.getFormParams = this.getFormParams.bind(this);
    this.mapStateToProps = this.mapStateToProps.bind(this);
  }

  getComponent() {
    return Filter;
  }

  getFormParams() {
    return {
      form: this.formName,
      enableReinitialize: true,
    };
  }

  mapStateToProps(state, ownProps) {
    const cleanPath = get(state, 'routing.locationBeforeTransitions.pathname');
    const searchStr = get(state, 'routing.locationBeforeTransitions.search', '', 'String').replace(/^\?/, '');
    const queryParams = qs.parse(searchStr, { parseArrays: false }) || {};
    const fields = ownProps.fields;

    let initialValues = {};
    if (typeof ownProps.queryDecode === 'function') {
      initialValues = ownProps.queryDecode({
        searchParams: queryParams,
        filterFields: fields,
      });
    } else {
      initialValues = {
        query: queryParams.query || null,
        filter: queryParams.filter || {},
      };
    }
    // Enforces proper value formats for form's fields
    initialValues.filter = Utils.prepareFilterValues(initialValues.filter, fields);

    const selectedQuery = get(state, `form.${this.formName}.values.query`, '');
    const selectedFilters = get(state, `form.${this.formName}.values.filter`, {});
    const selectedFiltersCount = Utils.countNonEmptyValues(selectedFilters);
    const filteredByList = Utils.getFilterTooltipText(
      selectedFilters,
      fields.reduce((accumulator, entry) => {
        accumulator[entry.name] = entry.label;
        return accumulator;
      }, {})
    );

    return {
      cleanPath,
      selectedQuery,
      selectedFilters,
      initialValues,
      selectedFiltersCount,
      filteredByList,
      type: ownProps.type,
      fields,
      queryEncode: ownProps.queryEncode,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      setSearch: actions.router.setSearch,
      goTo: path => goToPage(path),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      clear: () => dispatchProps.goTo(stateProps.cleanPath),
    };
  }

}
