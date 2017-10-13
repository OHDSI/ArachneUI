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
import { Button, LoadingPanel } from 'arachne-ui-components';
import ProgressDots from 'components/ProgressDots';
import { nameAnalysisType } from 'modules/AnalysisExecution/const';

require('./style.scss');

function CohortLoading({ selectedSource, totalSteps, step, goBack, analysisType }) {
  const classes = new BEMHelper('code-import-loader');

  const BackBtn = (
    <Button
      mods={['cancel']}
      onClick={goBack}
      label="Back"
    />
  );

  return (
    <div {...classes()}>
      <div {...classes('panel')}>
        <LoadingPanel
          active={true}
          label={
            `${nameAnalysisType(analysisType, true)}s are being summoned.
            Please wait a moment...`
          }
        />
      </div>
      <div {...classes('progress')}>
        <ProgressDots totalSteps={totalSteps} step={step} backBtn={BackBtn} />
      </div>
    </div>
  );
}

export default CohortLoading;
