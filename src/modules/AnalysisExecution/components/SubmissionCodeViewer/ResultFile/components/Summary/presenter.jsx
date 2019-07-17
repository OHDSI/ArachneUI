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
import isEmpty from 'lodash/isEmpty';
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
    currentAnalysisType,
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
      specificSummary = <SummaryIncidence resultInfo={resultInfo} />;
      break;
    case analysisTypes.COHORT: case analysisTypes.COHORT_HERACLES:
      specificSummary = <SummaryCohort resultInfo={resultInfo} />;
      break;
    case analysisTypes.ESTIMATION: case analysisTypes.PREDICTION:
      specificSummaryMods.narrow = false;
      specificSummaryMods.wide = true;
      specificSummaryMods.padded = false;
      specificSummary = <SummaryPopulationLevel resultInfo={resultInfo} />;
      break;
  }
  const statusMods = get(submission, 'status.value') ? statusColors[get(submission, 'status.value', '')] : null;

  return (
    <div {...classes()}>
      <ResultInfoBlock>
        <div {...classes('panel', 'padded')}>
          <Panel title={'Analysis'}>
            <div {...classes('panel-content')}>
              <ul {...classes('list')}>
                <li {...classes('list-item')}>
                  {nameAnalysisType({ analysisType: currentAnalysisType, capitalize: true })}
                  {submissionGroupType !== currentAnalysisType
                    ? ` (had been executed as ${nameAnalysisType({ analysisType: submissionGroupType, capitalize: true })})`
                    : ''
                  }
                </li>
                <li {...classes('list-item')}>{moment(analysis.created).tz(moment.tz.guess()).format(commonDate)}</li>
              </ul>
            </div>
          </Panel>
        </div>
        <div {...classes('panel', 'padded')}>
          <Panel title={'Submission details'}>
            <div {...classes('panel-content')}>
              <ul {...classes('list')}>
                <li {...classes('list-item')}>
                  <span {...classes({ element: 'status', modifiers: statusMods })}>
                    {get(submission, 'status.title', '')}
                  </span>
                </li>
                <li {...classes('list-item')}>{moment(get(submission, 'createdAt', '')).tz(moment.tz.guess()).format(commonDate)}</li>
                <li {...classes('list-item', 'data-source')}>
                  <LabelDataSource {...datasource} />
                </li>
              </ul>
            </div>
          </Panel>
        </div>
      </ResultInfoBlock>
      {specificSummary && !isEmpty(resultInfo) &&
        <ResultInfoBlock>
          <div {...classes('panel', specificSummaryMods)}>
            <Panel title={'Result summary'}>
              <div {...classes('panel-content')}>
                {specificSummary}
              </div>
            </Panel>
          </div>
        </ResultInfoBlock>
      }
    </div>
  );
}
