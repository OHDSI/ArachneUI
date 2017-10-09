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
 * Created: December 27, 2016
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import { Toolbar, Link } from 'arachne-ui-components';
import moment from 'moment-timezone';
import { paths } from 'modules/AnalysisExecution/const';
import { commonDate as commonDateFormat } from 'const/formats';

require('./style.scss');

function AnalysisToolbar(props) {
  const classes = new BEMHelper('analysis-toolbar');
  const {
    analysisTitle,
    createdAt,
    backUrl,
    breadcrumbList,
    editTitle,
    author,
  } = props;

  return (
    <Toolbar
      caption={analysisTitle}
      breadcrumbList={breadcrumbList}
      backUrl={backUrl}
      onEdit={editTitle}
    >
      <span {...classes('created-at')}>
        Created {moment(createdAt).tz(moment.tz.guess()).format(commonDateFormat)} {author.id &&
          <span>
            by <Link to={paths.profile(author.id)}>
              {author.firstname} {(author.middlename || '').substr(0, 1)} {author.lastname}
            </Link>
          </span>
        }
      </span>
    </Toolbar>
  );
}

export default AnalysisToolbar;
