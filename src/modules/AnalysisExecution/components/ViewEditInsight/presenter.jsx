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
 * Created: May 05, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { LoadingPanel, PageContent } from 'arachne-ui-components';
import Toolbar from './Toolbar';
import Description from './Description';
import Sections from './Sections';
import Comments from './Comments';
import ModalEditTitle from './ModalEditTitle';
import Details from './Details';

require('./style.scss');

function ViewEditInsight({ isLoading, submissionId, pageTitle, isEditable }) {
  const classes = new BEMHelper('insight-view');

  return (
    <PageContent title={pageTitle}>
      <div {...classes()}>
        <Toolbar isEditable={isEditable}/>
        <div {...classes('content')}>
          <div className="row">
            <div {...classes('block', null, 'col-xs-12')}>
              <Details />
            </div>
          </div>
          <div className="row">
            <div {...classes('block', null, 'col-xs-12')}>
              <Description submissionId={ submissionId } isEditable={isEditable} />
            </div>
          </div>
          <div className="row">
            <div {...classes('block', null, 'col-xs-12 col-md-6')}>
              <Sections />
            </div>
            <div {...classes('block', null, 'col-xs-12 col-md-6')}>
              <Comments submissionId={ submissionId } />
            </div>
          </div>
        </div>
        <ModalEditTitle submissionId={ submissionId } />
        <LoadingPanel active={isLoading} />
      </div>
    </PageContent>
  );
}

export default ViewEditInsight;
