/*
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
 * Authors: Anton Gackovka
 * Created: May 31, 2018
 */

import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Workspace from 'modules/StudyManager/components/Workspace';

function Routes() {
  return [
    <Route path="home" component={Workspace}/>,
    <Route path="user/:userId" component={Workspace}/>,
    <IndexRedirect to="home" />,
  ];
}

export default Routes;
