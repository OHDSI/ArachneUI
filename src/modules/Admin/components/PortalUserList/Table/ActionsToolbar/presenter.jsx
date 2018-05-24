/*
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
 * Authors: Anton Gackovka
 * Created: May 23, 2018
 */

import React from 'react';
import { Toolbar, Button } from 'arachne-ui-components';

require('./style.scss');

/**
 * @return {null}
 */
function ActionsToolbar
({
   children = null,
   selectedUsers,
   batchDelete,
   openAddUsersToTenantsModal,
 }) {

  return (
    selectedUsers.length > 0 ? 
      <Toolbar>
        <Button onClick={batchDelete} label='New user(s)'/>
        <Button onClick={batchDelete} label='Resend emails'/>
        <Button onClick={openAddUsersToTenantsModal} label='Add to tenant'/>
        <Button onClick={batchDelete} label='Enable/disable'/>
        <Button onClick={batchDelete} label='Confirm/Invalidate email'/>
        <Button onClick={batchDelete} label='Delete'/>
        <span>{`Selected ${selectedUsers.length} elements`}</span>
      </Toolbar> 
      :
      null
  );
}

export default ActionsToolbar
;
