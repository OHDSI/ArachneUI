/*
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
 * Created: January 16, 2017
 *
 */

import expertsList from './expertsList';
import userProfile from './userProfile';
import professionalType from './professionalTypes';
import skill from './skills';
import myProfile from './myProfile';
import invitation from './invitations';
import study from './studies';
import province from './provinces';
import country from './countries';
import facets from './facets';

export default {
  actions: {
    expertsList: expertsList.actions,
    userProfile: userProfile.actions,
    professionalType: professionalType.actions,
    skill: skill.actions,
    myProfile: myProfile.actions,
    invitation: invitation.actions,
    study: study.actions,
    province: province.actions,
    country: country.actions,
    facets: facets.actions,
  },
  reducer: {
    expertsList: expertsList.reducer,
    userProfile: userProfile.reducer,
    professionalType: professionalType.reducer,
    skill: skill.reducer,
    myProfile: myProfile.reducer,
    invitation: invitation.reducer,
    study: study.reducer,
    province: province.reducer,
    country: country.reducer,
    facets: facets.reducer,
  },
};
