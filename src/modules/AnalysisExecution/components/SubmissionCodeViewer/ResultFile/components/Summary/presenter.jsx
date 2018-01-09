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
 * Created: December 20, 2017
 *
 */

import React from 'react';
import EmptyState from 'components/EmptyState';
import LabelDataSource from 'components/LabelDataSource';
import { analysisTypes, nameAnalysisType, statusColors } from 'modules/AnalysisExecution/const';
import BEMHelper from 'services/BemHelper';
import moment from 'moment';
import { commonDate } from 'const/formats';
import {
  Panel,
} from 'arachne-ui-components';
import { get } from 'services/Utils';
import SummaryIncidence from './Incidence';
import SummaryCohort from './Cohort';
import SummaryPopulationLevel from './PopulationLevel';

import './style.scss';

function ResultInfoBlock({ children }) {
  const classes = BEMHelper('submission-result-summary');

  return (
    <div {...classes('summary-block')}>
      <div {...classes('sub-block')}>
        {children}
      </div>
    </div>
  );
}

export default function SubmissionResultSummary(props) {
  const {
    resultInfo,
    analysis,
    submissionGroupType,
    submission,
    datasource,
  } = props;
  const classes = BEMHelper('submission-result-summary');

  if (!analysis) {
    return <EmptyState message={'Summary'} />;
  }

  let specificSummary = null;
  const specificSummaryMods = {
    narrow: true,
    wide: false,
    padded: true,
  };

  switch (submissionGroupType) {
    case analysisTypes.INCIDENCE:
      specificSummaryMods.padded = false;
      specificSummary = <SummaryIncidence analysis={analysis} resultInfo={resultInfo} />;
      break;
    case analysisTypes.COHORT: case analysisTypes.COHORT_CHARACTERIZATION:
      specificSummary = <SummaryCohort analysis={analysis} resultInfo={resultInfo} />;
      break;
    case analysisTypes.ESTIMATION: case analysisTypes.PREDICTION:
      specificSummaryMods.narrow = false;
      specificSummaryMods.wide = true;
      specificSummaryMods.padded = false;
      specificSummary = <SummaryPopulationLevel analysis={analysis} resultInfo={resultInfo} />;
      break;
  }
  const statusMods = get(submission, 'status.value') ? statusColors[get(submission, 'status.value', '')] : null;

  return (
    <div {...classes()}>
      <ResultInfoBlock>
        <Panel title={'Analysis'} {...classes('panel', 'padded')}>
          <div {...classes('panel-content')}>
            <ul {...classes('list')}>
              <li {...classes('list-item')}>{nameAnalysisType({ analysisType: submissionGroupType, capitalize: true })}</li>
              <li {...classes('list-item')}>{moment(analysis.createdAt).tz(moment.tz.guess()).format(commonDate)}</li>
            </ul>
          </div>
        </Panel>
        <Panel title={'Submission details'} {...classes('panel', 'padded')}>
          <div {...classes('panel-content')}>
            <ul {...classes('list')}>
              <li {...classes('list-item')}>
                <span {...classes({ element: 'status', modifiers: statusMods })}>
                  {get(submission, 'status.title', '')}
                </span>
              </li>
              <li {...classes('list-item')}>{moment(get(submission, 'createdAt', '')).tz(moment.tz.guess()).format(commonDate)}</li>
              <li {...classes('list-item')}>
                <LabelDataSource {...datasource} />
              </li>
            </ul>
          </div>
        </Panel>
      </ResultInfoBlock>
      {specificSummary &&
        <ResultInfoBlock>
          <Panel title={'Result summary'} {...classes('panel', specificSummaryMods)}>
            <div {...classes('panel-content')}>
              {specificSummary}
            </div>
          </Panel>
        </ResultInfoBlock>
      }
    </div>
  );
}
