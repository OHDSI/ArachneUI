/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: October 06, 2017
 *
 */

import invitation from './invitations';
import buildInfo from './buildInfo';
import settings from './settings';
import search from './search';
import myProfile from './myProfile';
import userSettings from './userSettings';

export default {
  actions: {
    buildInfo: buildInfo.actions,
    invitation: invitation.actions,
    myProfile: myProfile.actions,
    settings: settings.actions,
    search: search.actions,
    userSettings: userSettings.actions,
  },
  reducer: {
    buildInfo: buildInfo.reducer,
    invitation: invitation.reducer,
    myProfile: myProfile.reducer,
    settings: settings.reducer,
    search: search.reducer,
    userSettings: userSettings.reducer,
  },
};
