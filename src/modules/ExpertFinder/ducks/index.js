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
import professionalTypes from './professionalTypes';
import skills from './skills';
import invitations from './invitations';
import studies from './studies';
import provinces from './provinces';
import countries from './countries';
import facets from './facets';

export default {
  actions: {
    expertsList: expertsList.actions,
    userProfile: userProfile.actions,
    professionalTypes: professionalTypes.actions,
    skills: skills.actions,
    invitations: invitations.actions,
    studies: studies.actions,
    provinces: provinces.actions,
    countries: countries.actions,
    facets: facets.actions,
  },
  reducer: {
    expertsList: expertsList.reducer,
    userProfile: userProfile.reducer,
    professionalTypes: professionalTypes.reducer,
    skills: skills.reducer,
    invitations: invitations.reducer,
    studies: studies.reducer,
    provinces: provinces.reducer,
    countries: countries.reducer,
    facets: facets.reducer,
  },
};
