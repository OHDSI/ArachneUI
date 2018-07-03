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
 * Created: February 03, 2017
 *
 */

import React from 'react';
import { Toolbar } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { healthStatuses } from 'const/dataSource';
import TitleLabeled from 'components/TitleLabeled';
import { paths } from 'modules/DataCatalog/const';
import ToolbarActions from '../ToolbarActions';

require('./style.scss');

function ViewDataSourceToolbar({
	backUrl,
	name,
  healthStatus,
  isDeleted,
  mode,
  children = null,
}) {
  const classes = new BEMHelper('data-source-toolbar-caption');
  const tooltipClass = new BEMHelper('tooltip');

  const dsCaption = (<div {...classes()}>
    <div
      {...classes({
        element: 'indicator',
        modifiers: [healthStatus.value],
        extra: tooltipClass().className,
      })}
      aria-label={healthStatuses.getTitle(healthStatus.value)}
      data-tootik-conf="right"
      >
    </div>
    <span>
      {name}
    </span>
  </div>);

  const title = <TitleLabeled
    label={isDeleted ? 'deleted' : null}
    labelDescr='Datasource is deleted'
    title={dsCaption}
  />;

  const breadcrumbList = [
    {
      link: paths.dataCatalog(),
      label: <span {...classes('breadcrumb')}>Data Catalog</span>,
    },
  ];


  return (
    <Toolbar caption={title} backUrl={backUrl} breadcrumbList={breadcrumbList} >
      <ToolbarActions mode={mode} />
      {children}
    </Toolbar>
  );
}

export default ViewDataSourceToolbar;
