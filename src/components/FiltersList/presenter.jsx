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
 * Created: September 11, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  BadgedIcon,
  FacetedSearchPanel as FacetedSearch,
  Panel,
  Form,
  FormSelect,
  FormToggle,
  FormSlider,
  FormInput,
} from 'arachne-ui-components';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import types from 'const/modelAttributes';
import filterTypes from 'const/filterTypes';
import uniqBy from 'lodash/uniqBy';

require('./style.scss');

function getComponentByType(type) {
  switch (type) {
    case types.enum: case types.enumMulti:
      return FormSelect;
    case types.toggle:
      return FormToggle;
    case types.integer:
      return FormSlider;
    case types.string:
      return FormInput;
    default:
      return null;
  }
}

function getOptions(field) {
  switch (field.type) {
    case types.enum: case types.enumMulti:
      return {
        mods: ['bordered'],
        title: field.label,
        placeholder: 'Any',
        isMulti: field.isMulti || field.type === types.enumMulti,
      };
    case types.toggle:
      return {
        label: field.label,
        isManaged: true,
      };
    case types.integer:
      return {
        title: field.label,
        min: field.min,
        max: field.max,
      };
    case types.string:
      return {
        title: field.label,
        placeholder: field.label,
        mods: ['bordered'],
      };
    default:
      return null;
  }
}

function FacetedFilters({ clear, fields }) {
  return (
    <FacetedSearch
      doSubmit={() => {}}
      dynamicFields={fields}
      fullTextSearchEnabled
      sortingEnabled={false}
      showRefineSearch
      isAccordion
      doClear={clear}
      handleSubmit={() => {}}
      mods={['no-submit']}
    />
  );
}

function DropdownFilters({ classes, fields, clear, handleSubmit}) {
  const keywordsField = {
    type: types.string,
    label: 'Keywords',
  };
  const dropdownFields = [
    {
      name: 'query',
      InputComponent: {
        component: getComponentByType(keywordsField.type),
        props: {
          ...getOptions(keywordsField),
        },
      },
    }
  ];

  fields.forEach((field) => {
    let options = field.options;
    if (!field.isMulti && field.type !== types.enumMulti) {
      options = [{
        label: 'Any',
        value: '',
      }].concat(field.options);
    }
    dropdownFields.push({
      // assure it's compatable with the form in FacetedSearch component
      name: `filter[${field.name}]`,
      InputComponent: {
        component: getComponentByType(field.type),
        props: {
          options: uniqBy(options, 'value'),
          ...getOptions(field),
        },
      },
    });
  });

  return (
    <Panel
      mods={['black-header']}
      title={'Filter'}
    >
      <div {...classes('filters')}>
        <Form
          fields={dropdownFields}
          onSubmit={() => {}}
          handleSubmit={handleSubmit}
          cancelBtn={{
            mods: ['cancel', 'rounded'],
            label: 'Clear',
          }}
          onCancel={clear}
        />
      </div>
    </Panel>
  );
}

function FiltersList(props) {
  const classes = new BEMHelper('filters-list');
  const {
    className,
    selectedFiltersCount,
    fields = [],
    clear,
    filteredByList = [],
    type,
    handleSubmit,
  } = props;

  const isDropdown = type === filterTypes.dropdown;

  return isDropdown
    ? <Dropdown {...classes(null, 'dropdown')}>
      <DropdownTrigger {...classes('icon')}>
        <BadgedIcon
          {...classes('toggle-btn', null, selectedFiltersCount ? 'ac-tooltip' : null)}
          icon={'filter_list'}
          count={selectedFiltersCount}
          aria-label={`Filtered by ${filteredByList.join(', ')}`}
          data-tootik-conf={'multiline left'}
        />
      </DropdownTrigger>
      <DropdownContent>
        <div {...classes('content', null, className)}>
          <DropdownFilters classes={classes} fields={fields} clear={clear} handleSubmit={handleSubmit}/>
        </div>
      </DropdownContent>
    </Dropdown>
    : <div {...classes(null, 'column')}>
      <div {...classes('filters', null, className)}>
        <FacetedFilters fields={fields} clear={clear} />
      </div>
    </div>;
}

FiltersList.propTypes = {
  className: PropTypes.string,
  selectedFiltersCount: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      forceOpened: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        })
      ),
    })
  ),
  clear: PropTypes.func.isRequired,
  filteredByList: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(['column', 'dropdown']),
};

export default FiltersList;
