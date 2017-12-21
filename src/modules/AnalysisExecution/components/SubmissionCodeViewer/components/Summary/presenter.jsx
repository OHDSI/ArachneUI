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
import { analysisTypes, nameAnalysisType, statusColors } from 'modules/AnalysisExecution/const';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-ui-components';
import SummaryIncidence from './Incidence';

import './style.scss';
import moment from 'moment';
import { commonDate } from 'const/formats';

export default function SubmissionResultSummary(props) {
  const {
    resultInfo,
    analysis,
    submissionGroupType,
    submission,
  } = props;
  const classes = BEMHelper('submission-result-summary');

  if (!analysis) {
    return <EmptyState message={'Summary'} />;
  }

  let specificSummary = null;
  
  switch (submissionGroupType) {
    case analysisTypes.INCIDENCE:
      specificSummary = <SummaryIncidence analysis={analysis} resultInfo={resultInfo} {...classes('summary-block')} />;
      break;
  }
  const statusMods = submission.status.value ? statusColors[submission.status.value] : null;

  return (
    <div {...classes()}>
      <div {...classes('summary-block')}>
        <span {...classes('header')}>Analysis</span>
        <div {...classes('sub-block')}>          
          <div {...classes('panel-content')}>
            Type: {nameAnalysisType({ analysisType: submissionGroupType })}
          </div>
          <div {...classes('panel-content')}>
            Created: {moment(analysis.createdAt).tz(moment.tz.guess()).format(commonDate)}
          </div>
        </div>
      </div>
      <div {...classes('summary-block')}>
        <span {...classes('header')}>Submission</span>
        <div {...classes('sub-block')}>
          <div {...classes('panel-content')}>
            Status: <span {...classes({ element: 'status', modifiers: statusMods })}>
              {submission.status.title}
            </span>
          </div>
          <div {...classes('panel-content')}>
            Created: {moment(submission.createdAt).tz(moment.tz.guess()).format(commonDate)}
          </div>
        </div>
      </div>
      {specificSummary}
    </div>
  );
}
