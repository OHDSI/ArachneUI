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
 * Created: February 10, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import InviteModal from 'modules/ExpertFinder/components/InviteModal';
import InviteConfirmModal from 'modules/ExpertFinder/components/InviteConfirmModal';
import EmptyState from 'components/EmptyState';
import ExpertCard from './ExpertCard';

require('./style.scss');

function List(props) {
  const {
    userList,
    showInviteDialog,
  } = props;
  const classes = new BEMHelper('experts-list-content');

  return (
    <div {...classes()}>
      <div {...classes('list', userList.length === 0 ? 'empty' : null)}>
        {userList.length === 0
          ? <EmptyState message={'No results found'} />
          : userList.map((expert, key) =>
          <ExpertCard key={key} expert={expert} showInviteDialog={showInviteDialog} />
        )}
      </div>
      <InviteModal />
      <InviteConfirmModal />
    </div>);
}

List.propTypes = {
  currentPage: PropTypes.string,
  data: PropTypes.array,
  reload: PropTypes.func,
  showInviteDialog: PropTypes.func,
};

export default List;
