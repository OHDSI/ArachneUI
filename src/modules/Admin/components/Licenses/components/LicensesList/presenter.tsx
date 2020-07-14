/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellText,
  Link,
} from 'arachne-ui-components';
import { License, Vocabulary } from 'modules/Admin/components/Licenses/types';

require('./style.scss');

function CellRemove(props: any) {
  const { remove } = props;
  return <Button onClick={remove}>Remove</Button>;
}

function CellVocabs(props: any) {
  const { value, openEditModal } = props;
  const classes = BEMHelper('licenses-list');
  
  return <Link onClick={openEditModal}>
    {`${value.count} vocabularies`} {value.pendingCount > 0
      ? <span {...classes('pending')}>({value.pendingCount} pending)</span>
      : ''
    }
  </Link>;
}

function CellEmail(props: any) {
  return <Link
    {...props}
    to={`mailto:${props.value}`}
  >
    {props.value}
  </Link>;
}

interface IListProps {
  licenses: Array<License>;
  openEditModal: Function;
  removeAll: Function;
};

function Results(props: IListProps) {
  const {
    licenses,
    openEditModal,
    removeAll,
  } = props;
  const classes = BEMHelper('licenses-list');

  return (
    <div {...classes()}>
      <Table
        data={licenses}
        mods={['padded']}
      >
        <TableCellText
          {...classes('name')}
          header='User'
          field='user.name'
        />
        <CellEmail
          {...classes('email')}
          header='Email'
          field='user.email'
        />
        <CellVocabs
          {...classes('voc')}
          header='Vocabularies'
          field='vocabularies'
          props={(entity: License) => ({
            value: {
              count: entity.vocabularies.length,
              pendingCount: entity.pendingCount,
            },
            openEditModal: () => openEditModal(entity),
          })}
        />
        <CellRemove
          props={(entity: License) => ({
            remove: () => removeAll(entity),
          })}
        />
      </Table>
     </div>
  );
}

export default Results;
