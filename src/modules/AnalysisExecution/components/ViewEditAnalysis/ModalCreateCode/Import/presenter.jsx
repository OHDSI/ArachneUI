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
 * Created: July 03, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import NodeSelector from './NodeSelector';
import ImportList from './ImportList';
import ImportLoading from './ImportLoading';
import NotAvailable from './NotAvailable';

require('./style.scss');

function ImportCode(props) {
  const classes = new BEMHelper('code-import');
  const {
    isImportRunning,
    isImportAvailable,
    selectedSource,
    resetSource,
    selectSource,
    analysisType,
    analysesImportError,
  } = props;

  let panels;

  if (isImportAvailable) {
    panels = [
      // First step - select Data node to import data from
      {
        order: 1,
        element: <NodeSelector onSelect={selectSource} />,
        showIf: () => !selectedSource,
      },
      // Second - wait while list of Cohorts is loaded
      {
        order: 2,
        element: <ImportLoading
          selectedSource={selectedSource}
          goBack={resetSource}
          analysesImportError={analysesImportError}
        />,
        showIf: () => selectedSource && isImportRunning,
      },
      // Third - select desired resource from the Data node
      {
        order: 2,
        element: <ImportList
          selectedSource={selectedSource}
          goBack={resetSource}
        />,
        showIf: () => selectedSource && !isImportRunning,
      }
    ];
  } else {
    panels = [
      {
        order: 1,
        element: <NotAvailable />,
        showIf: () => true,
      }
    ]
  }

  return (
    <div {...classes()}>
      {panels
        .filter(panel => panel.showIf())
        .map(panel =>
          <div {...classes('panel')}>
            {React.cloneElement(
              panel.element,
              {
                totalSteps: panels[panels.length - 1].order,
                order: panel.order,
                step: panel.order,
              }
            )}
          </div>
        )}
    </div>
  );
}

export default ImportCode;
