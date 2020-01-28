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
 * Created: April 13, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Checkbox,
} from 'arachne-ui-components';
import { Field } from 'redux-form';
import { healthStatuses } from 'const/dataSource';

require('./style.scss');

function DataSource({ options, input }) {
  const classes = new BEMHelper('datasources-list');
  const tooltipClasses = new BEMHelper('tooltip');
  const healthClasses = new BEMHelper('datasources-list-health');

  return (
    <li
      {...classes({
        element: 'data-source',
        modifiers: { disabled: options.disabled }
      })}
    >
      <Checkbox
        {...classes('checkbox')}
        isChecked={input.value}
        onChange={input.onChange}
        label={''}
      />
      <div {...healthClasses()}>
        <div {...healthClasses({
            element: 'indicator',
            modifiers: [options.healthStatus.value],
            extra: tooltipClasses().className,
          })}
          aria-label={healthStatuses.getTitle(options.healthStatus.value)}
          data-tootik-conf="right"
        ></div>
      </div>
      <div
        {...classes('checkbox-label-container')}
        onClick={() => input.onChange(!input.value)}
      >
        <span {...classes('checkbox-label')}>
          {options.label}
        </span>
      </div>
    </li>
  );
}

function DataSources(props) {
  const classes = new BEMHelper('datasources-list');

  const {
    dataSources,
  } = props;
  return (
    <ul {...classes()}>
      {dataSources && dataSources.map((dataSource, key) =>
        <Field
          key={key}
          component={DataSource}
          options={{
            ...dataSource,
            disabled: props.disabled,
          }}
          name={`dataSources[${dataSource.value}]`}
        />
      )}
    </ul>
  );
}

export default DataSources;
