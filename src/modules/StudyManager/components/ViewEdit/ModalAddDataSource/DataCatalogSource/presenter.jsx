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
 * Created: June 23, 2017
 *
 */

import React from "react";
import { ListItem, Checkbox, FormAutocomplete, Fieldset, Button } from 'arachne-ui-components';
import { Field } from 'redux-form';
import BEMHelper from "services/BemHelper";
import LabelDataSource from 'components/LabelDataSource';
import { healthStatuses } from 'const/dataSource';

require('./style.scss');

function DataSourceOption({ options, input }) {
  const classes = new BEMHelper('ds-option');

  return (
    <ListItem
      {...classes()}
    >
      <Checkbox
        isChecked={input.value === true}        
        onChange={() => input.onChange(!input.value)}
      >
        <div {...classes('label')}>
          <LabelDataSource {...options} />
        </div>
      </Checkbox>
    </ListItem>
  );
}

function AddDataCatalogSource(props) {
  const classes = new BEMHelper('study-form-add-catalog-ds');
  const filterField = {
    name: 'filter',
    InputComponent: {
      component: FormAutocomplete,
      props: {
        ...classes('search-field'),
        placeholder: 'Filter by name',
        mods: ['bordered'],
        options: [],
        fetchOptions: props.loadDataSourceOptions,
        clearable: false,
        onSelectResetsInput: false,
        onBlurResetsInput: false,
      },
    },
  };

  return (
		<div {...classes({ modifiers: { 'has-options': props.dataSourceOptions.length } })}>
      <form {...props} onSubmit={props.handleSubmit(props.doSubmit)}>
        {props.isOpened &&
          <Field component={Fieldset} {...filterField} />
        }
        <div {...classes('data-sources')}>
          {props.dataSourceOptions.map(option => {
            const ds = {
              name: `dataSourceId[${option.value}]`,
              InputComponent: {
                component: DataSourceOption,
                props: {
                  mods: ['bordered'],
                  options: option,
                }
              }
            };

            return <Field component={Fieldset} {...ds} />
          })
        }
        {props.restItemsCount > props.dataSourceOptions.length &&
          <div {...classes('rest')}>
            <span>Total {props.restItemsCount} elements</span>
          </div>
        }
        </div>
        <div {...classes('actions')}>
          <Button
            {...classes('submit-btn')}
            type='submit'
            mods={['rounded', 'success']}
            disabled={props.isSaving}
          >
            {`${props.isSaving ? 'Adding' : 'Add data source'}`}
          </Button>
          <Button mods={['rounded', 'cancel']} onClick={props.closeModal}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export default AddDataCatalogSource;