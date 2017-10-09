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
 * Created: July 26, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Field } from 'redux-form';
import { Button, FormCheckbox, ListItem } from 'arachne-ui-components';
import ProgressDots from 'components/ProgressDots';
import { nameAnalysisType } from 'modules/AnalysisExecution/const';
import Fuse from 'fuse.js';

require('./style.scss');

function ImportList(props) {
  const classes = new BEMHelper('code-import-list');
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
    /* redux-forms */
    handleSubmit,
    submitting,
  } = props;
  const fuseSearch = new Fuse(entities, {
    shouldSort: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
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
            {`Select ${nameAnalysisType(analysisType)} from ${selectedSource.name}`}
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
        <ul {...classes('list')}>
          {entities.map((entity, key) => 
            <li
              key={key}
              {...classes({
                element: 'item',
                modifiers: {
                  hidden: !filteredEntitiesIds[entity.guid],
                },
              })}
            >
              <Field
                component={FormCheckbox}
                options={{
                  label: entity.name,
                }}
                name={`entities[${entity.guid}]`}
              />
            </li>
          )}
        </ul>
        {filteredEntities && filteredEntities.length
          ? null
          : <span {...classes('empty-state')}>
            {`No ${nameAnalysisType(analysisType)}s found`}
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
