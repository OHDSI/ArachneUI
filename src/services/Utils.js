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
 * Created: December 28, 2016
 *
 */

import errors from 'const/errors';
import isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import { types as fieldTypes } from 'const/modelAttributes';
import mimeTypes from 'const/mimeTypes';
import {
  isSql,
  isText,
} from 'services/MimeTypeUtil';
import { reduxForm, SubmissionError } from 'redux-form';
import numeral from 'numeral';
import keyMirror from 'keymirror';
import { typeCheck } from 'type-check';
import moment from 'moment';
import { commonDate } from 'const/formats';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { ModalUtils } from 'arachne-ui-components';
import types from 'const/modelAttributes';
import ReportUtils from 'components/Reports/Utils';
import { reports } from 'const/reports';
import URI from 'urijs';
import { createSelector } from 'reselect';

function buildFormData(obj) {
  const formData = new FormData();

  Object
    .keys(obj)
    .forEach(key => formData.append(key, obj[key]));

  return formData;
}

if (!numeral['locales']['arachne']) {
  numeral.register('locale', 'arachne', {
    delimiters: {
      thousands: ' ',
      decimal: '.',
    },
    abbreviations: keyMirror({
      thousand: null,
      million: null,
      billion: null,
      trillion: null,
    }),
  });
}

if (!numeral['locales']['arachne-short']) {
  numeral.register('locale', 'arachne-short', {
    delimiters: {
      thousands: ' ',
      decimal: '.',
    },
    abbreviations: {
      thousand: 'k',
      million: 'mil',
      billion: 'bn',
      trillion: 'tn',
    },
  });
}

const numberFormatter = {
  format: (value, form = 'full') => {
    if (form === 'short') {
      numeral.locale('arachne-short');
    } else {
      numeral.locale('arachne');
    }
    return numeral(value).format('0[.]0 a');
  },
};

const getSelectedOption = (options, value) =>
  // NOTE: initial value of input should not be null
  // otherwise React will mark input as uncontrolled
   options.filter(o => o.value === value)[0] || { value: '' };

// Sorts values in "list" by string value located in "key"
// And puts "lastValue" value to the end of list
function sortOptions(list, { key = 'label', lastValue = 'Other' } = {}) {
  list.sort((a, b) => {
    const typeA = a[key].toUpperCase(); // ignore upper and lowercase
    const typeB = b[key].toUpperCase(); // ignore upper and lowercase
    const LAST_VALUE = lastValue.toUpperCase();

    if (typeB === LAST_VALUE) return -1;
    if (typeA === LAST_VALUE) return 1;

    if (typeA < typeB) return -1;
    if (typeA > typeB) return 1;
    return 0;
  });
  return list;
}

function get(from, path, defaultVal, typeCheckRule) {
  let result;

  if (typeCheckRule) {
    result = _get(from, path);
    result = typeCheck(typeCheckRule, result) ? result : defaultVal;
  } else {
    result = _get(from, path, defaultVal);
  }

  return result;
}

function getFormSelectedCheckboxes(selection = {}) {
  const res = [];
  Object.keys(selection).forEach((key) => {
    if (selection[key] === true) {
      res.push(key);
    }
  });
  return res;
}

const validators = {
  checkPassword({ password, passwordConfirmation }) {
    if (!password) {
      return undefined;
    }
    return isEqual(password, passwordConfirmation)
      ? undefined
      : {
        password: 'Password and password confirmation must match',
        passwordConfirmation: 'Password and password confirmation must match',
      };
  },

  checkValidationError(response) {
    if (typeof response.errorCode !== 'undefined') {
      if ([errors.VALIDATION_ERROR, errors.ALREADY_EXIST].includes(response.errorCode)) {
        throw new SubmissionError({
          _error: response.errorMessage,
          ...response.validatorErrors,
        });
      } else if (response.errorCode === errors.UNACTIVATED) {
        throw new SubmissionError({
          _error: 'Please verify your account using link in the email that was sent to you.',
          unactivated: true,
        });
      } else if (response.errorCode !== errors.NO_ERROR) {
        throw new SubmissionError({
          _error: response.errorMessage,
          errorMessage: 'System error',
        });
      }
    }
  },


};

function canUseDom() {
  return (typeof window !== 'undefined' && typeof document !== 'undefined' && document.documentElement);
}

const detectLanguage = (mimeType) => {
  let language;
  if (mimeType === mimeTypes.r) {
    language = 'r';
  } else if (isSql(mimeType)) {
    language = 'text/x-sql';
  }
  return language;
};

const detectLanguageByExtension = (file) => {
  let language;
  if (file) {
    const docType = file.docType;
    if (!isText(docType)) {
      language = file.docType;
    } else {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension === mimeTypes.r) {
        language = 'r';
      } else if (extension === mimeTypes.sql) {
        language = 'text/x-sql';
      }
    }
  }
  return language;
};

const detectMimeTypeByExtension = (file) => {
  let type;
  if (file) {
    type = file.docType;
    if (ReportUtils.getReportType(type) !== reports.unknown) {
      type = mimeTypes.report;
    } else if (type === mimeTypes.text) {
      const extension = file.name.split('.').pop().toLowerCase();
      type = mimeTypes[extension];
    }
  }
  return type;
};

class Utils {

  static assignFacets(filterList, facets) {
    filterList.forEach((field) => {
      if ([fieldTypes.enum, fieldTypes.enumMulti].includes(field.type)) {
        field.options.forEach((option) => {
          let facetId = option.value;
          if (isNaN(facetId)) {
            facetId = facetId.toString().toLowerCase();
          }
          option.facetCount = get(facets, `${field.name}.${facetId}`, 0);
        });
      }
    });
  }

  static fetchAll({ fetchers, dispatch }) {
    return Promise.all(Object.values(fetchers).map(fetcher => fetcher.then ? /* promise */ fetcher : /* action */ dispatch(fetcher())));
  }

  static buildConnectedComponent({
    Component,
    mapStateToProps = null,
    getMapDispatchToProps = null, // if it should be defined as Object (this is done due to unavailability of extending of getters in TS)
    mapDispatchToProps = null, // if it should be defined as Function
    mergeProps = null,
    getModalParams = null,
    getFormParams = null,
    getFetchers = null,
  } = {}) {
    let WrappedComponent = Component;

    if (getModalParams) {
      WrappedComponent = ModalUtils.connect(getModalParams())(WrappedComponent);
    }

    if (getFormParams) {
      WrappedComponent = reduxForm(getFormParams())(WrappedComponent);
    }

    let ConnectedComponent = connect(
      mapStateToProps,
      getMapDispatchToProps ? getMapDispatchToProps() : mapDispatchToProps,
      mergeProps
    )(WrappedComponent);

    if (getFetchers) {
      ConnectedComponent = asyncConnect([{
        promise: ({ params, store: { dispatch, getState } }) => {
          const state = getState();
          const fetchers = getFetchers({ params, state, dispatch, getState });
          return Utils.fetchAll({ fetchers, dispatch });
        },
      }])(ConnectedComponent);
    }

    return ConnectedComponent;
  }

  static castValue(rawValue, { type, options }) {
    let parsedValue;

    // If enum - use label
    switch (type) {
      case fieldTypes.enum: {
        parsedValue = _get(
          options.filter(o => o.value.toString() === rawValue.toString()),
          '[0].label',
          null,
        );
        break;
      }
      case fieldTypes.enumMulti: {
        parsedValue = options.filter(o => rawValue.indexOf(o.value) !== -1).map(option => option.label).join(', ');
        break;
      }
      case fieldTypes.date: {
        parsedValue = moment(rawValue).format(commonDate);
        break;
      }
      case fieldTypes.integer: {
        parsedValue = numberFormatter.format(rawValue, 'full');
        break;
      }
      default: {
        parsedValue = rawValue;
      }
    }

    return parsedValue;
  }

  static isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return !value;
  }

  static getFilterTooltipText(fields, names) {
    const words = [];
    for (const field in fields) {
      if (!Utils.isEmpty(fields[field])) {
        words.push(names[field]);
      }
    }

    return words;
  }

  static countNonEmptyValues(object) {
    return Object.values(object)
      .filter(setting => !Utils.isEmpty(setting))
      .length;
  }
  
  static prepareFilterValues(query, fieldsSpecification = []) {
    const initialValues = {};
    const fieldsMap = {};
    fieldsSpecification.forEach((field) => {
      fieldsMap[field.name] = field;
    });
    Object.keys(query).forEach((paramName) => {
      const field = fieldsMap[paramName];
      const paramValue = query[paramName];
      if (!field) {
        return false;
      }
      switch (field.type) {
        case fieldTypes.enum:
          if (field.isMulti) {
            initialValues[field.name] = Array.isArray(paramValue) ? paramValue : (typeof paramValue === 'object' ? Object.values(paramValue) : [paramValue]);
          } else {
            initialValues[field.name] = paramValue;
          }
          break;
        case fieldTypes.toggle:
          initialValues[field.name] = !!paramValue;
          break;
        default:
          initialValues[field.name] = paramValue;
          break;
      }
    });

    return initialValues;
  }

  static confirmDelete({ message = 'Are you sure?' } = {}) {
    const promise = new Promise((resolve, reject) => {
      if (confirm(message)) {
        resolve();
      }
    });
    return promise;
  }

  static extendReducer(originalReducer, newReducerMap) {
    return (state = {}, action) => {
      let communityState = originalReducer(state, action);
      let nextState = { ...communityState };
      let hasChanged = false;

      Object.keys(newReducerMap).forEach(key => {
        const reducer = newReducerMap[key];
        const previousStateForKey = state[key];
        const nextStateForKey = reducer(previousStateForKey, action);
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      });

      return hasChanged ? nextState : communityState;
    }
  }

  static setUrlParams(url, query) {
    const uri = new URI(url);
    if (query) {
      uri.setSearch(query);
    }
    return uri.toString();
  }

  static getSavedFiltersRestorer({ getSavedFilter, basePath }) {
    return (nextState, replace, callback) => {
      let query = nextState.location.query;
      if (!query || Object.keys(query).length === 0) {
        const savedFilter = getSavedFilter();
        query = {
          ...savedFilter,
          page: 1,
        };
        replace({ pathname: basePath, query });
      }
      callback();
    };
  }

  static getFilterFromLS(lsKey) {
    let savedFilter;
    try {
      savedFilter = JSON.parse(localStorage.getItem(lsKey));
      if (!savedFilter || typeof savedFilter !== 'object') {
        throw new Error();
      }
    } catch (e) {
      savedFilter = {};
    }
    const filter = {};
    Object.keys(savedFilter).forEach((key) => {
      if (!Utils.isEmpty(savedFilter[key])) {
        filter[key] = savedFilter[key];
      }
    });
    return filter;
  }

  static getPlainFiltersEncodeDecoder() {
    return {
      searchQueryDecode({ searchParams = {}, filterFields }) {
        return {
          query: searchParams.query,
          page: searchParams.page,
          filter: searchParams,
        };
      },
      searchQueryEncode({ searchParams, filterFields }) {
        return {
          ...searchParams.filter,
          query: searchParams.query,
          page: searchParams.page,
        };
      },
    };
  }

}

class ContainerBuilder {

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps ?
        this.mapStateToProps.bind(this):
        this.mapStateToProps,
      getMapDispatchToProps: this.getMapDispatchToProps,
      mapDispatchToProps: this.mapDispatchToProps,
      mergeProps: this.mergeProps,
      getModalParams: this.getModalParams,
      getFormParams: this.getFormParams,
      getFetchers: this.getFetchers
        ? this.getFetchers.bind(this)
        : this.getFetchers,
    });
  }
}

class TreemapSelectorsBuilder {
  constructor() {
    this.dataPath = '';
    this.detailsPath = '';
  }

  getReportData(state) {
    return get(state, this.dataPath, {});
  }

  getRawTableData(state) {
    return get(state, this.dataPath) || [];
  }

  getRawDetails(state) {
    return get(state, this.detailsPath);
  }

  extractTableData(rawTableData) {
    return [];
  }

  extractReportDetails(rawReportDetails) {
    return {};
  }

  buildSelectorForTableData() {
    return createSelector(
      this.getRawTableData.bind(this),
      this.extractTableData
    );
  }

  buildSelectorForReportDetails() {
    return createSelector(
      this.getRawDetails.bind(this),
      this.extractReportDetails
    );
  }

  build() {
    return {
      getReportData: this.getReportData.bind(this),
      getTableData: this.buildSelectorForTableData(),
      getReportDetails: this.buildSelectorForReportDetails(),
    };
  }
}

export {
  buildFormData,
  get,
  getFormSelectedCheckboxes,
  getSelectedOption,
  numberFormatter,
  sortOptions,
  validators,
  canUseDom,
  detectLanguage,
  detectLanguageByExtension,
  detectMimeTypeByExtension,
  Utils,
  ContainerBuilder,
  TreemapSelectorsBuilder,
};
