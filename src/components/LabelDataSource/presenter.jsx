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
 * Created: June 04, 2017
 *
 */

import React, { PropTypes } from 'react';
import { get } from 'services/Utils';
import BEMHelper from 'services/BemHelper';
import {
  Link,
} from 'arachne-ui-components';
import { healthStatuses } from 'const/dataSource';
import { paths as dataCatalogPaths } from 'modules/DataCatalog/const';

require('./style.scss');

function LabelDataSource({ className, color, statusTitle, subtitle, name, uuid, isLink = false }) {
  const classes = new BEMHelper('label-data-source');
  const tooltipClass = new BEMHelper('tooltip');
  const modifier = subtitle ? 'with-subtitle' : '';
  const content = subtitle
    ? [<span>{name}</span>, <span {...classes('subtitle')}>{subtitle}</span>]
    : name;

  return (
    <div {...classes({ extra: className })}>
      <div
        {...classes({
          element: 'indicator',
          modifiers: color,
          extra: tooltipClass().className,
        })}
        aria-label={statusTitle}
        data-tootik-conf="right"
      >
      </div>
      {isLink
        ? <Link {...classes('name')} to={dataCatalogPaths.dataCatalog(uuid)}>{content}</Link>
        : <span {...classes('name', modifier)} title={name}>{content}</span>
      }
    </div>
  );
}

LabelDataSource.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  statusTitle: PropTypes.string,
  name: PropTypes.string,
};

function dnConverter(dataNode = {}) {
  const healthStatus = get(dataNode, 'healthStatus');
  let color;
  let statusTitle;

  if (healthStatus) {
    color = healthStatuses[healthStatus].color;
    statusTitle = healthStatuses[healthStatus].title;
  }

  return {
    id: dataNode.id,
    uuid: dataNode.uuid,
    color,
    statusTitle,
    name: get(dataNode, 'name', 'Not published', 'String'),
    published: dataNode.published,
  };
}

function dsConverter(dataSource = {}) {
  const healthStatus = get(dataSource, 'healthStatus');
  const {
    name,
  } = dnConverter(dataSource.dataNode);
  let color;
  let statusTitle;

  if (healthStatus) {
    color = healthStatuses.getColor(healthStatus);
    statusTitle = healthStatuses.getTitle(healthStatus);
  }

  const dsName = get(dataSource, 'name', '');
  const fullName = `${name}: ${dsName}`;

  return {
    id: dataSource.id,
    uuid: dataSource.uuid,
    color,
    statusTitle,
    name: fullName,
    published: dataSource.published,
    publishedLabel: dataSource.published ? 'Yes' : 'No',
  };
}

export default LabelDataSource;
export {
  dsConverter,
  dnConverter,
};
