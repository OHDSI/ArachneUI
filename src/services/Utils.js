/**
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
import {
  get as _get,
  isEqual,
} from 'lodash';
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
    if (type === mimeTypes.text) {
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
    return Promise.all(Object.values(fetchers).map(action => dispatch(action())));
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
          const fetchers = getFetchers({ params, state, dispatch });
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
        case types.enum:
          if (field.isMulti) {
            initialValues[field.name] = Array.isArray(paramValue) ? paramValue : [paramValue];
          } else {
            initialValues[field.name] = paramValue;
          }
          break;
        case types.toggle:
          initialValues[field.name] = !!paramValue;
          break;
        default:
          initialValues[field.name] = paramValue;
          break;
      }
    });

    return initialValues;
  }

  static prepareChartDataForDonut(rawData = { CONCEPT_ID: [], COUNT_VALUE: [], CONCEPT_NAME: [] }) {
    const values = Array.isArray(rawData.COUNT_VALUE) ? rawData.COUNT_VALUE : [rawData.COUNT_VALUE];
    const legend = Array.isArray(rawData.CONCEPT_NAME) ? rawData.CONCEPT_NAME : [rawData.CONCEPT_NAME];
    const ids = Array.isArray(rawData.CONCEPT_ID) ? rawData.CONCEPT_ID : [rawData.CONCEPT_ID];
    return values.map((value, i) => ({
      value,
      label: legend[i],
      id: ids[i],
    }));
  }

  static confirmDelete({ message = 'Are you sure?' } = {}) {
    const promise = new Promise((resolve, reject) => {
      if (confirm(message)) {
        resolve();
      }
    });
    return promise;
  }

}

class ContainerBuilder {
  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      getMapDispatchToProps: this.getMapDispatchToProps,
      mapDispatchToProps: this.mapDispatchToProps,
      mergeProps: this.mergeProps,
      getModalParams: this.getModalParams,
      getFormParams: this.getFormParams,
      getFetchers: this.getFetchers,
    });
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
};
