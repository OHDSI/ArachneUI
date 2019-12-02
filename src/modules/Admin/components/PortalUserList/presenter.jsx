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
 * Created: September 29, 2017
 *
 */

import React, { Component } from 'react';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import Table from './Table';
import ModalAddUser from './ModalAddUser';
import ModalAddUserBatch from './ModalAddUserBatch';
import Grid from 'components/Grid';
import PortalUserListActions from './Actions';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

export default class UserList extends Component {

  getModals() {
    return [<ModalAddUser />, <ModalAddUserBatch />];
  }

  render() {
    const {
      isLoading,
      paginationDetails,
      filterFields,
      searchQueryDecode,
      searchQueryEncode,
      onPageOutOfRange,
      isAdmin,
    } = this.props;
    const classes = new BEMHelper('admin-panel-user-list');
    if (!isAdmin) {
      return <div {...classes('access-denied-title')}>The page you're looking for can't be found</div>;
    }
    return (
      <PageWrapper>
        <Grid
          isLoading={isLoading}
          title="Settings | Users"
          paginationDetails={paginationDetails}
          filterFields={filterFields}
          Actions={<PortalUserListActions />}
          searchQueryDecode={searchQueryDecode}
          searchQueryEncode={searchQueryEncode}
          onPageOutOfRange={onPageOutOfRange}
        >
          <Table />
        </Grid>
        { this.getModals() }
      </PageWrapper>
    );
  }
}
