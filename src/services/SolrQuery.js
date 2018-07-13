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
 * Created: February 06, 2017
 *
 */

import { types as fieldTypes } from 'const/modelAttributes';
import omit from 'lodash/omit';
import { get } from 'services/Utils';

function parseSolrValue(value, { type, isMulti }) {
  let parsedValue;

  switch (type) {
    // Interval
    case fieldTypes.integer: {
      const parts = value.match(/\[(\d+) TO (\d+)\]/); // eslint-disable-line no-useless-escape
      if (parts.length === 3) {
        parsedValue = {
          from: parseInt(parts[1], 10),
          to: parseInt(parts[2], 10),
        };
      }
      break;
    }
    case fieldTypes.enum:
      parsedValue = value;
      break;
    case fieldTypes.enumMulti:
    case fieldTypes.string:
      parsedValue = value
        .replace(/(^\(|\)$)/g, '') // eslint-disable-line no-useless-escape
        .split(' OR ')
        .map(entry => entry.replace(/(^"|"$)/g, ''));
      break;
    default:
      parsedValue = value;
      break;
  }

  return parsedValue;
}

function parseSolrValues(data, attributeList) {
  const parsed = {};

  if (typeof data === 'object') {
    attributeList.forEach((attribute) => {
      const solrValue = data[attribute.name];
      if (solrValue) {
        parsed[attribute.name] = parseSolrValue(solrValue, attribute);
      }
    });
  }

  return parsed;
}

function convertToSolrValue(value) {
  let convertedValue = value;
  // object with min-max -> interval
  if (
    value instanceof Object &&
    typeof value.from !== 'undefined' &&
    typeof value.to !== 'undefined'
  ) {
    convertedValue = `[${value.from} TO ${value.to}]`;
  }
  // array -> list of options
  if (Array.isArray(value) && value.length > 0) {
    convertedValue = `("${value.join('" OR "')}")`;
  }
  return convertedValue;
}

function convertToSolrValues(data, attributeList) {
  const parsed = {};

  if (typeof data === 'object') {
    attributeList.forEach((attr) => {
      const rawValue = get(data, attr.name);
      if (rawValue) {
        parsed[attr.name] = convertToSolrValue(rawValue);
      }
    });
  }

  return parsed;
}

function convertToSolrSearchParams({ searchParams, filterFields }) {
  const solrFilterFields = convertToSolrValues(
    searchParams,
    filterFields,
  );
  const solrSearchParams = {
    ...omit(searchParams, Object.keys(solrFilterFields)),
    filter: solrFilterFields,
  };
  return solrSearchParams;
}

const filterListEncoderDecoder = {
  searchQueryDecode: ({ searchParams = {}, filterFields }) => ({
    ...searchParams,
    filter: parseSolrValues(searchParams.filter || {}, filterFields),
  }),
  searchQueryEncode: ({ searchParams = {}, filterFields }) => ({
    ...searchParams,
    filter: convertToSolrValues(searchParams.filter, filterFields),
  }),
};

export {
  convertToSolrValues,
  convertToSolrSearchParams,
  parseSolrValues,
  filterListEncoderDecoder,
};
