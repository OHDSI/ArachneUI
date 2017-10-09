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
 * Created: July 13, 2017
 *
 */

import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import clamp from 'clamp-js';
import BEMHelper from 'services/BemHelper';
import { Button, Link, Panel, LoadingPanel } from 'arachne-components';
import Comment from 'components/Comment';
import LabelSubmissionStatus from 'components/LabelSubmissionStatus';
import {
  usDateOnly as dateFormat,
  commonDate as fullDateFormat
} from 'const/formats';
import { paths as analysisPaths } from 'modules/AnalysisExecution/const';

require('./style.scss');

function CommentDetails({ details }) {
  const classes = new BEMHelper('comment-details'); 

  return (
    <span {...classes()}>
      {details.label}
      <span {...classes('entity')}>{details.entity}</span>
    </span>
  );
}

function InsightSummary(props) {
  const classes = new BEMHelper('study-insight-summary');
  const {
    id,
    title,
    descr,
    createdAt,
    commentsCount,
    analysis: {
      id: analysisId,
      title: analysisTitle,
    },
    dataSource: {
      name: dataSourceName,
    },
    submission: {
      id: submissionId,
      status: submissionStatus,
    },
    resultFiles,
    annotationList,
  } = props;

  const insightUrl = analysisPaths.insight({ submissionId });

  return (
    <div {...classes()}>
      <div {...classes('main')}>
        <div {...classes('heading')}>
          <Link
            {...classes('analysis-title')}
            to={ analysisPaths.analyses(analysisId) }
          >
            {analysisTitle}
          </Link>
          <Link
            {...classes('insight-title')}
            to={ insightUrl }
          >
            {title}
          </Link>
          <span
            {...classes('date')}
            title={ moment(createdAt).tz(moment.tz.guess()).format(fullDateFormat) }
          >
            { moment(createdAt).tz(moment.tz.guess()).format(dateFormat) }
          </span>
        </div>
        <span
          {...classes('descr')}
          ref={(el) => {
            el && clamp(el, { clamp: 2, useNativeClamp: false, truncationChar: '...' })
          }}
        >
          {descr}
        </span>
        <ul {...classes('detail-list')}>
          <li {...classes('detail', 'data-source')} title={`Data source: ${dataSourceName}`}>
            {/*https://materialdesignicons.com/icon/database*/}
            <img
              {...classes('data-source-ico')}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAAZVJREFUSMftlbFuE0EQhr+ZRXLhwklpVyRSnoAUyA8AykWQyiXJC1jrntShPXykB4nSogLZggKJDksWEi8QI4G3SONrXBjLuxRcYdm+nHGJ/EvbzOzMN7t/MbBTgSQv0Wg0TK1WOwkhRMADETkA9rJ0GkIYisgA6Dnnep1OZ74xwFp7JiIvgfsbDvpDVW0cx+8LAdbaCxF5fdfrchRCCBdJkrxdDOoKUeRqi+ZZqbxYDuqai2GL5rm16wCXW0I88LwQ4L3/rKpnwPAfmg9F5Kkx5kshQFWv4jj+4Jw7CiGcAtfAV+AW+J2d2yx2LSKRc+6oUqn05vP5igf31kxzbq3d9963kiTpAt2i8ZvN5sF4PH4lIqfAsyLALxF5YoyJWq3WR6DnvR+USqWbcrmcAkwmk73pdHqoqsdABDwCDPBzkxdcAm+yggiIVJXZbEaapotfuWIfO5Pz9H+bbJYD/X7/e71e/xZCeAjsb+Iwf00+b7fb75YTdy6carX6WEROgGPgkIWFA9wAAxHpjkajT3kLZ6dC/QGYmMt1rg7rhAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0xMVQxMjowOTozNSswMDowMKGh56UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMTFUMTI6MDk6MzUrMDA6MDDQ/F8ZAAAAKHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy90bXAvbWFnaWNrLTEybTNGakth3yKw0gAAAABJRU5ErkJggg=="
            />
            <span
              {...classes('data-source')}
            >
              {dataSourceName}
            </span>
          </li>
          <li {...classes('detail', 'status')}>
            {/*<i {...classes('status-ico')}>
              flash_on
            </i>*/}
            <span {...classes('status-label')}>
              <LabelSubmissionStatus status={submissionStatus} />
            </span>
          </li>
          {/*<li {...classes('detail', 'results')}>
            <i {...classes('results-ico')}>
              insert_drive_file
            </i>
            <span {...classes('results-link')}>
              <Link to={ insightUrl }>{resultFiles.length} result files</Link>
            </span>
          </li>*/}
        </ul>
      </div>
      {annotationList.length ?
        <div {...classes('annotation-block')}>
          <div {...classes('annotation-list')}>
            {annotationList.map((data, key) =>
              <div {...classes('annotation')} key={key}>
                <Comment
                  {...data}
                  ResponseDetail={<CommentDetails details={data.responseDetails} />}
                  dateFormat={dateFormat}
                />
              </div>
            )}
          </div>
          {(commentsCount > annotationList.length) ?
            <div {...classes('annotation-show-all')}>
              <Link to={ insightUrl }>
                see all { commentsCount > 1 ? `${commentsCount} annotations` : `${commentsCount} annotation` }
              </Link>
            </div>
            :
            null
          }
        </div>
        :
        null
      }
    </div>
  )
}

function InsightList(props) {
  const classes = new BEMHelper('study-insight-list');
  const {
    insightList,
  } = props;

  if (!insightList || !insightList.length) {
    return null;
  }

  return (
    <Panel
      {...classes()}
      title="Insights"
    >
      <div {...classes('content')}>
        {insightList.map((insight, key) =>
          <InsightSummary {...insight} />
        )}
      </div>
    </Panel>
  );
}

export default InsightList;
