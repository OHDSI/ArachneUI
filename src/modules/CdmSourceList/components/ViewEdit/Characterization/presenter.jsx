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
 * Created: June 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Panel,
} from 'arachne-ui-components';
import moment from 'moment';
import { commonDate } from 'const/formats';
import { nodeFunctionalModes } from 'modules/Auth/const';

require('./style.scss');

function Characterization(props) {
  const classes = new BEMHelper('report-characterization');

  const {
    isCharacterizationStarted,
    lastCharacterization,
    hasResults,
    update,
    importResults,
    characterizationSource,
    runningMode,
  } = props;

  const isImporting = isCharacterizationStarted && characterizationSource === 'IMPORT';
  const isGenerating = isCharacterizationStarted && characterizationSource === 'GENERATION';
  const isStandalone = runningMode === nodeFunctionalModes.Standalone;

  return (
    <div {...classes()}>
      <Panel title="Achilles reports">
        <div {...classes({ element: 'row', extra: 'row' })}>
          <div {...classes({ element: 'label', extra: 'col-xs-5' })}>
            Last update
          </div>
          <div {...classes({ element: 'date', extra: 'col-xs-7' })}>
            {lastCharacterization
              ? moment(lastCharacterization).format(commonDate)
              : 'never'
            }
          </div>
        </div>
        <div {...classes({ element: 'row', modifiers: 'actions' })}>
          <Button
            {...classes('btn')}
            label={isImporting ? 'Importing' : lastCharacterization ? 'Re-import' : 'Import'}
            mods={['success', 'rounded']}
            disabled={isCharacterizationStarted || !hasResults || isStandalone}
            onClick={importResults}
          />
          <Button
            {...classes('btn')}
            label={isGenerating ? 'Generating' : lastCharacterization ? 'Re-generate' : 'Generate'}
            mods={['submit', 'rounded']}
            disabled={isCharacterizationStarted}
            onClick={update}
          />
        </div>
      </Panel>
    </div>
  );
}

export default Characterization;
