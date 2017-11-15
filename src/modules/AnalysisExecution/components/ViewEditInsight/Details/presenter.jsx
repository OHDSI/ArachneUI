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
 * Created: June 04, 2017
 *
 */

import React from 'react';
import get from 'lodash/get';
import BEMHelper from 'services/BemHelper';
import { Link, Select, Tabs, Panel } from 'arachne-ui-components';
import LabelDataSource from 'components/LabelDataSource';
import LabelSubmissionStatus from 'components/LabelSubmissionStatus';

require('./style.scss');

function DataSource(props) {
  const classes = new BEMHelper('insight-data-source');
  const {
    dataSource
  } = props;

  return (
    <Panel
      {...classes()}
      title="Data source"
    >
      <div {...classes('content')}>
        <LabelDataSource
          {...dataSource}
        />
      </div>
    </Panel>
  );
}

function SubmissionDetails({ author, createdAt, status }) {
  const classes = new BEMHelper('insight-submission-details');

  return (
    <Panel
      {...classes()}
      title="Submission details"
    >
      <div {...classes('content')}>
        <ul {...classes('list')}>
          <li {...classes('list-item')}>
            <LabelSubmissionStatus status={status} />
          </li>
          <li {...classes('list-item')}>
            { createdAt }
          </li>
          <li {...classes('list-item')}>
            <Link to={author.link}>{author.name}</Link>
          </li>
        </ul>
      </div>
    </Panel>    
  )
}

function Details(props) {
  const {
    author,
    createdAt,
    dataSource,
    submissionStatus,
  } = props;

  return (
    <div className="row">
      <div className="col-xs-12 col-md-5">
        <DataSource
          dataSource={dataSource}
        />
      </div>
      <div className="col-xs-12 col-md-7">
        <SubmissionDetails status={submissionStatus} createdAt={createdAt} author={author} />
      </div>
    </div>
  );
}

export default Details;