/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: July 19, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { 
  ExpandableText,
  ListItem,
  LoadingPanel,
  PageContent,
  Panel
} from 'arachne-ui-components';
import DatePanel from 'components/DatePanel';
import LabelDataSource from 'components/LabelDataSource';
import EmptyState from 'components/EmptyState';
import Toolbar from './Toolbar';
import DocumentPanel from './DocumentPanel';
import Modals from './Modals';
import PeopleBuilder from './participants';

require('./style.scss');

function Objective({ text }) {
  const classes = new BEMHelper('insight-view-objective');

  return (
    <Panel title="Study Objective">
      <div {...classes()}>
        <ExpandableText text={text} />
      </div>
    </Panel>
  );
}

function DataSources({ dataSourceList }) {
  const classes = new BEMHelper('insight-view-data-sources');

  return (
    <Panel title="Data sources used">
      {dataSourceList.length ?
        <ul {...classes()}>
          {dataSourceList.map(ds => 
            <ListItem>
              <LabelDataSource {...ds} isLink={true} />
            </ListItem>
          )}
        </ul>
        :
        <div {...classes({ modifiers: 'empty' })}>
          No data sources were used
        </div>
      }
    </Panel>
  );
}

function ViewEditInsight(props) {
  const {
    insight: {
      id,
      studyCreated,
      studyStartDate,
      studyEndDate,
      studyTitle = 'Study',
      objective,
      dataSourceList,
      protocols,
      papers,
      publishedDate,
    },
    permissions,
    isLoading,
  } = props;

  const classes = new BEMHelper('insight-view');
  const dateFormat = 'MM/DD/YYYY';

  return (
    <PageContent title={`${studyTitle} | Insights library | Arachne`}>
      {id
        ? <div {...classes()}>
          <Toolbar />
          <div {...classes('content')}>
            <div className="row">
              <div className="col-xs-12 col-md-3">
                <DatePanel
                  {...classes('initial-proposal')}
                  title={'Initial proposal'}
                  selected={studyCreated}
                  isEditable={false}
                  dateFormat={dateFormat}
                />
              </div>
              <div className="col-xs-12 col-md-3">
                <DatePanel
                  title={'Start'}
                  selected={studyStartDate}
                  isEditable={false}
                  dateFormat={dateFormat}
                />
              </div>
              <div className="col-xs-12 col-md-3">
                <DatePanel
                  title={'Finished'}
                  selected={studyEndDate}
                  isEditable={false}
                  dateFormat={dateFormat}
                />
              </div>
              <div className="col-xs-12 col-md-3">
                <DatePanel
                  title={'Published'}
                  selected={publishedDate}
                  isEditable={false}
                  dateFormat={dateFormat}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-7">
                <div {...classes('objective')}>
                  <Objective text={objective} />
                </div>
                <div {...classes('data-sources')}>
                  <DataSources dataSourceList={dataSourceList} />
                </div>
              </div>
              <div className="col-xs-12 col-md-5">
                <div {...classes('protocol')}>
                  <DocumentPanel
                  title="Protocols"
                  type={'PROTOCOL'}
                  files={protocols}
                  canManageFiles={permissions.EDIT_PAPER}
                />
                </div>
                <div {...classes('paper')}>
                  <DocumentPanel
                  title="Papers"
                  type={'PAPER'}
                  files={papers}
                  canManageFiles={permissions.EDIT_PAPER}
                />
                </div>
                {new PeopleBuilder(props, classes).build()}
              </div>
            </div>
          </div>
        </div>
        : <EmptyState message={'You do not have permissions to view this insight'} />
      }
      <Modals />
      <LoadingPanel active={isLoading} />
    </PageContent>
  );
}

export default ViewEditInsight;
