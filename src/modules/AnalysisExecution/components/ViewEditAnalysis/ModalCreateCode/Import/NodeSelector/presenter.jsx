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
 * Created: July 03, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Field } from 'redux-form';
import { Button } from 'arachne-ui-components';
import LabelDataSource from 'components/LabelDataSource';
import ProgressDots from 'components/ProgressDots';
import { nameAnalysisType } from 'modules/AnalysisExecution/const';

require('./style.scss');

function Node({ options, input }) {
  const classes = new BEMHelper('code-import-node');
  const {
    dataNode
  } = options;

  return (
    <div {...classes()} onClick={() => input.onChange(dataNode)}>
      <LabelDataSource {...dataNode} />
      <i {...classes('select-ico')}>
        keyboard_arrow_right
      </i>
    </div>
  );
}

function NodeSelector({ dataNodeList, totalSteps, step, analysisType }) {
  const classes = new BEMHelper('code-import-node-selector');

  if (dataNodeList.length > 0) {
    return (
      <div {...classes()}>
        <span {...classes('descr')}>
          {`Choose data node to import ${nameAnalysisType({ analysisType })} from`}
        </span>
        <form>
          <ul {...classes('list')}>
            {dataNodeList.map((dn, key) => 
              <li
                key={key}
                {...classes('item')}
              >
                <Field
                component={Node}
                options={{
                  dataNode: dn,
                }}
                name={`dataNode`}
              />
              </li>
            )}
          </ul>
        </form>
        <div {...classes('progress')}>
          <ProgressDots totalSteps={totalSteps} step={step} />
        </div>
      </div>
    );
  } else {
    return (
      <div {...classes()}>
        <span {...classes('descr', 'empty')}>
          No data nodes connected to Atlas are presented in the study.
        </span>
      </div>
    )
  }  
}

export default NodeSelector;
