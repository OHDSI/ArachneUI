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
 * Created: April 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Button, Panel } from 'arachne-ui-components';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import { solrDomains } from 'modules/Admin/const';
// import DynamicDataForm from 'components/DynamicDataForm';
import formFactory from 'components/DynamicDataForm/factory';
import {
  LoadingPanel,
} from 'arachne-ui-components';
import { get } from 'services/Utils';

require('./style.scss');

function SystemSettings(props) {
  const classes = new BEMHelper('admin-panel-sys-settings');
  const {
    isApplied,
    applySettings,
    isLoading,
    doSubmit,
    settingGroupList,
    solrReindex,
    reindexProcess,
  } = props;

  const isReindexing = domain => get(reindexProcess, `[${domain}]`);

  const formComponentList = settingGroupList.map((formData, index) => {
    const Form = formFactory({
      name: formData.name,
      initialValues: formData.initialValues,
    });
    return (
      <div className="col-xs-12 col-md-6" key={index}>
        <div {...classes('panel')}>
          <Panel title={formData.label}>
            <Form
              dynamicFields={formData.fieldList}
              doSubmit={(data) => doSubmit(formData.name, data)}
            />
          </Panel>
        </div>
      </div>
    )
  })

  return (
    <PageWrapper>
      <div {...classes()}>
        {!isApplied &&
          <div {...classes('apply-banner')}>
            <span {...classes('apply-banner-hint')}>
              Some settings were changed, but have not been applied yet. To apply settings, you need to restart server.
            </span>
            <Button
              {...classes('apply-banner-btn')}
              label={'Restart server'}
              onClick={applySettings}
            />
          </div>
        }
        {__APP_TYPE_CENTRAL__
          ?
            <div {...classes('action-bar')}>
              <div {...classes('action-bar-btn')}>
                <Button
                  mods={['default']}
                  label={`${isReindexing(solrDomains.users.value) ? 'Indexing' : 'Reindex'} Expert Finder`}
                  onClick={() => solrReindex({ domain: solrDomains.users })}
                  disabled={isReindexing(solrDomains.users.value)}
                />
              </div>
              <div {...classes('action-bar-btn')}>
                <Button
                  {...classes('reindex-solr')}
                  mods={['default']}
                  label={`${isReindexing(solrDomains.dataSources.value) ? 'Indexing' : 'Reindex'} Data Catalog`}
                  onClick={() => solrReindex({ domain: solrDomains.dataSources })}
                  disabled={isReindexing(solrDomains.dataSources.value)}
                />
              </div>
              <div {...classes('action-bar-btn')}>
                <Button
                  {...classes('reindex-solr')}
                  mods={['default']}
                  label={`${isReindexing(solrDomains.studies.value) ? 'Indexing' : 'Reindex'} Study Notebook`}
                  onClick={() => solrReindex({ domain: solrDomains.studies })}
                  disabled={isReindexing(solrDomains.studies.value)}
                />
              </div>
              <div {...classes('action-bar-btn')}>
                <Button
                  {...classes('reindex-solr')}
                  mods={['default']}
                  label={`${isReindexing(solrDomains.analyses.value) ? 'Indexing' : 'Reindex'} Analyses`}
                  onClick={() => solrReindex({ domain: solrDomains.analyses })}
                  disabled={isReindexing(solrDomains.analyses.value)}
                />
              </div>
              <div {...classes('action-bar-btn')}>
                <Button
                  {...classes('reindex-solr')}
                  mods={['default']}
                  label={`${isReindexing(solrDomains.papers.value) ? 'Indexing' : 'Reindex'} Papers`}
                  onClick={() => solrReindex({ domain: solrDomains.papers })}
                  disabled={isReindexing(solrDomains.papers.value)}
                />
              </div>
            </div>
          : null
        }
        <div {...classes('content')}>
          <div className="row">
            {formComponentList}
          </div>
        </div>
      </div>
      <LoadingPanel active={ isLoading } />
    </PageWrapper>
  );
}

export default SystemSettings;
