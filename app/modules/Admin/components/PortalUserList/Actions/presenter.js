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
 * Created: October 05, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';
import { Button } from 'arachne-components';
import AdminPagesSelector from 'modules/Admin/components/PageWrapper/Toolbar/AdminPagesSelector';

require('./style.scss');

function PortalUserListActions(props) {
  const classes = new BEMHelper('admin-portal-user-list-actions');
  const { openModal } = props;

  return (
    <ul {...classes()}>
      <li {...classes('action')}>
        <Button {...classes('btn')} onClick={openModal}>
          <i {...classes('btn-ico')}>add_circle_outline</i>
        </Button>
      </li>
      <li {...classes('action', 'pages')}>
        <AdminPagesSelector />
      </li>
    </ul>
  );
}

export default PortalUserListActions;