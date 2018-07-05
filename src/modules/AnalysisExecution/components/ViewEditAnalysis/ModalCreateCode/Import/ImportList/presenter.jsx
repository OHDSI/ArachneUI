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
 * Created: July 26, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Field } from 'redux-form';
import { Button, RadioButton, ListItem, Fieldset } from 'arachne-ui-components';
import ProgressDots from 'components/ProgressDots';
import { nameAnalysisType } from 'modules/AnalysisExecution/const';
import Fuse from 'fuse.js';
import searchSettings from 'const/search';
import { VirtualList } from 'components/VirtualScroller';

require('./style.scss');
const classes = new BEMHelper('code-import-list');

function FormRadioButton({ input, options }) {
  return (
    <RadioButton
      {...classes('import-entity')}
      isChecked={options.isChecked}
      onChange={e => input.onChange(e.target.value)}
      label={options.label}
      value={options.value}
    />
  );
}

function ImportList(props) {
  const {
    isAnySelected,
    selectedSource,
    entities,
    doSubmit,
    step,
    totalSteps,
    goBack,
    analysisType,
    filterText,
    filter,
    selectedEntities,
    /* redux-forms */
    handleSubmit,
    submitting,
  } = props;
  const fuseSearch = new Fuse(entities, {
    ...searchSettings,
    keys: [
      'name',
    ],
  });
  const filteredEntities = filterText ? fuseSearch.search(filterText) : entities;
  const filteredEntitiesIds = {};
  filteredEntities.forEach((entity) => {
    filteredEntitiesIds[entity.guid] = true;
  });

  const BackBtn = (
    <Button
      mods={['cancel']}
      onClick={goBack}
      label="Back"
    />
  );

  const SubmitBtn = (
    <Button
      {...classes('submit')}
      disabled={!isAnySelected || submitting}
      type="submit"
      mods={['success']}
      label={submitting ? "Importing..." : "Import"}
    />
  );

  return (
    <div {...classes()}>
      {filteredEntities && filteredEntities.length
        ? <span {...classes('descr')}>
            {`Select ${nameAnalysisType({analysisType})} from ${selectedSource.name}`}
          </span>
        : null
      }
      <ListItem>
        <input
          {...classes('filter')}
          value={filterText}
          placeholder={'Filter by name or type'}
          onChange={e => filter(e.target.value)}
        />
      </ListItem>
      <form
        {...classes('form')}
        onSubmit={handleSubmit(doSubmit)}
      >
        <VirtualList
          {...classes({
            element: 'list',
            modifiers: {
              hidden: filteredEntities && !filteredEntities.length,
            },
          })}
          data={filteredEntities}
          rowRenderer={({ value }) => (
            <Field
              component={Fieldset}
              InputComponent={{
                component: FormRadioButton,
                props: {
                  options: {
                    label: value.name,
                    isChecked: value.selected,
                    value: value.guid,
                  },
                },
              }}
              name={'entity'}
            />
          )}
        />
        {filteredEntities && filteredEntities.length
          ? null
          : <span {...classes('empty-state')}>
            {`No ${nameAnalysisType({ analysisType, plural: true })} found`}
          </span>
        }
        <div {...classes('progress')}>
          <ProgressDots
            totalSteps={totalSteps}
            step={step}
            backBtn={BackBtn}
            nextBtn={SubmitBtn}
          />
        </div>
      </form>
    </div>
  );
}

export default ImportList;
