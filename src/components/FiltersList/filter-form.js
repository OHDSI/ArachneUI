/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import {
  SelectFilters,
} from 'arachne-ui-components';
import isEqual from 'lodash/isEqual';
import qs from 'qs';
import { anyOptionValue } from 'services/Utils';
import { types as fieldTypes } from 'const/modelAttributes';
import FilterPresenter from './presenter';
import actions from 'actions';

function buildSearchParams({
  filterFields,
  selectedQuery,
  selectedFilters,
  queryEncode = null,
}) {
  const valuesToUnsearch = {};
  filterFields.forEach((filter) => {
    if (!selectedFilters[filter.name]) {
      valuesToUnsearch[filter.name] = undefined;
    }
  });

  let searchParams = {
    filter: {
      ...selectedFilters,
      ...valuesToUnsearch,
    },
    query: selectedQuery,
    page: 1,
  };

  if (typeof queryEncode === 'function') {
    searchParams = queryEncode({
      searchParams,
      filterFields,
    });
  }

  return searchParams;
}

function countNonEmptyValues(selectedFilters, selectedQuery, fields, defaultVals) {
  const defaultFormattedVals = Utils.prepareFilterValues({}, fields , defaultVals);
  const changedFilters = Utils.plainDiff({ ...selectedFilters, selectedQuery }, { ...defaultFormattedVals, selectedQuery: '' } );
  return Utils.countNonEmptyValues(changedFilters);
}

/** @augments { Component<any, any> } */
class Filter extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.dirty && (!isEqual(nextProps.selectedFilters, this.props.selectedFilters) || nextProps.selectedQuery !== this.props.selectedQuery)) {
      // check whether Any option selected
      const selectedFilters = {};
      Object.keys(nextProps.selectedFilters)
        .forEach((filterName) => {
          let nextFilterValue = get(nextProps.selectedFilters, filterName, [], 'Array|Boolean|String');
          const existingFilterValue = get(this.props.selectedFilters, filterName, [], 'Array|Boolean|String');
          selectedFilters[filterName] = SelectFilters.clearOnEmptyOptionFilter(existingFilterValue, nextFilterValue);
        });

      const searchParams = buildSearchParams({
        filterFields: nextProps.fields,
        selectedQuery: nextProps.selectedQuery,
        selectedFilters: selectedFilters,
        queryEncode: nextProps.queryEncode,
      });

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
    const searchStr = get(state, 'routing.locationBeforeTransitions.search', '', 'String').replace(/^\?/, '');
    const searchParams = qs.parse(searchStr, { parseArrays: false }) || {};
    const fields = ownProps.fields;

    let initialValues = {};
    if (typeof ownProps.queryDecode === 'function') {
      initialValues = ownProps.queryDecode({
        searchParams: searchParams,
        filterFields: fields,
      });
    } else {
      initialValues = {
        query: searchParams.query || null,
        filter: searchParams.filter || {},
      };
    }
    // Enforces proper value formats for form's fields
    const defaultVals = fields.reduce((accum, f) => { accum[f.name] = f.type === fieldTypes.toggle ? false : anyOptionValue; return accum }, {});
    initialValues.filter = Utils.prepareFilterValues(
      initialValues.filter,
      fields,
      defaultVals
    );

    const selectedQuery = get(state, `form.${this.formName}.values.query`, '');
    const selectedFilters = get(state, `form.${this.formName}.values.filter`, {});
    const selectedFiltersCount = countNonEmptyValues(selectedFilters, selectedQuery, fields, defaultVals);
    const filteredByList = Utils.getFilterTooltipText(
      selectedFilters,
      fields.reduce((accumulator, entry) => {
        accumulator[entry.name] = entry.label;
        return accumulator;
      }, {})
    );

    return {
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
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      clear: () => {
        const emptyFilters = {};
        stateProps.fields.map(f => emptyFilters[f.name] = null);
        const searchParams = buildSearchParams({
          filterFields: stateProps.fields,
          selectedQuery: '',
          selectedFilters: emptyFilters,
          queryEncode: stateProps.queryEncode,
        });
        dispatchProps.setSearch(searchParams);
      },
    };
  }

}
