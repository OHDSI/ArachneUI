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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import {
  Link,
  ListItem
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { healthStatuses } from 'const/dataSource';

require('./style.scss');

function DataSourceItem(props) {
  const classes = new BEMHelper('study-datasource-item');
  const tooltipClasses = new BEMHelper('tooltip');
  const {
    dataSource,
    hasDeletePermissions,
    addDataSource,
    removeDataSource,
    editDataSource,
    hasEditStudyPermissions,
  } = props;

  const mods = {
    hover: true,
    actionable: hasDeletePermissions,
  };

  const actions = [];

  if (dataSource.canBeRecreated) {
    actions.push(
      <span key="add-ds"
        {...classes('action')}
        onClick={ () => addDataSource(dataSource.id) }
      >
        <i {...classes('action-ico', 'recreate')}>
          cached
        </i>
      </span>
    );
  }

  if (dataSource.canBeRemoved) {
    actions.push(
      <span key="remove-ds"
        {...classes('action')}
        onClick={() => removeDataSource(dataSource.id, dataSource.name)}
      >
        <i {...classes('action-ico', 'remove')}>
          close
        </i>
      </span>
    );
  }

  return (
    <ListItem
      mods={mods}
      actions={actions}
      {...classes({
        modifiers: {
          displaced: hasDeletePermissions && !dataSource.canBeRemoved && !dataSource.canBeRecreated,
        }
      })}
    >
      <div
        {...classes({
          element: 'indicator',
          modifiers: [healthStatuses.getColor(dataSource.healthStatus.value)],
          extra: tooltipClasses().className,
        })}
        aria-label={healthStatuses.getTitle(dataSource.healthStatus.value)}
        data-tootik-conf="right"
      />
      {dataSource.comment &&
        <Link
          {...classes({ element: 'comment', extra: 'ac-tooltip' })}
          aria-label={`Comment: ${dataSource.comment}`}
          data-tootik-conf='top multiline'
        >
          <div {...classes('comment-icon')}>chat_bubble</div>
        </Link>
      }
      {dataSource.isVirtual
        ? <VirtualDatasource isEditable={dataSource.isCurrentUserOwner && hasEditStudyPermissions} classes={classes} dataSource={dataSource} editDataSource={editDataSource} />
        : <Link {...classes('name')} to={dataSource.link}>{dataSource.name}</Link>
      }
      <span {...classes({ element: 'status', modifiers: dataSource.status.toLowerCase() })}>{dataSource.status}</span>
    </ListItem>
  );
}

function VirtualDatasource(props) {
    const {
      isEditable,
      classes,
      dataSource,
      editDataSource,
    } = props;

    return isEditable
      ? <Link {...classes('name')} onClick={() => editDataSource(dataSource.id)}>{dataSource.name}<span {...classes('ico')}>edit</span></Link>
      : <span {...classes('name')}>{dataSource.name}</span>;
}

ListDataSources.propTypes = {
  dataSource: PropTypes.object.isRequired,
  hasDeletePermissions: PropTypes.bool.isRequired,
  removeDataSource: PropTypes.func.isRequired,
}

function ListDataSources(props) {
  const classes = new BEMHelper('study-datasource-list');
  const {
    dataSourceList,
    hasAttachPermissions,
    hasDeletePermissions,
    openAddModal,
    addDataSource,
    removeDataSource,
    editDataSource,
    hasEditStudyPermissions,
  } = props;

  return (
    <ul {...classes()}>
      {dataSourceList.map((dataSource, key) =>
        <DataSourceItem
          dataSource={dataSource}
          hasDeletePermissions={hasDeletePermissions}
          addDataSource={addDataSource}
          removeDataSource={removeDataSource}
          key={key}
          editDataSource={editDataSource}
          hasEditStudyPermissions={hasEditStudyPermissions}
        />
      )}
      {dataSourceList.length === 0 &&
        <ListItem label="No attached data sources" />
      }
      {hasAttachPermissions &&
        <ListItem label="Add Data Source" mods="add" onClick={openAddModal} />
      }
    </ul>
  );
}

ListDataSources.propTypes = {
  dataSourceList: PropTypes.array.isRequired,
  hasAttachPermissions: PropTypes.bool.isRequired,
  hasDeletePermissions: PropTypes.bool.isRequired,
  openAddModal: PropTypes.func.isRequired,
  removeDataSource: PropTypes.func.isRequired,
}

export default ListDataSources;
