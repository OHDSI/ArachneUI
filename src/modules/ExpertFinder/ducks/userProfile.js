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
 * Created: January 16, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from 'modules/ExpertFinder/const';

const coreName = 'EF_USER_PROFILE';

const province = new Duck({
  name: coreName,
  urlBuilder: apiPaths.userProfile,
});
const generalInfo = new Duck({
  name: `${coreName}_GENERAL`,
  urlBuilder: apiPaths.updateUserProfile,
});
const publications = new Duck({
  name: `${coreName}_PUIBLICATION`,
  urlBuilder: apiPaths.userPublication,
});
const links = new Duck({
  name: `${coreName}_LINK`,
  urlBuilder: apiPaths.userLink,
});
const userPic = new Duck({
  name: `${coreName}_USERPIC`,
  urlBuilder: apiPaths.myUserpic,
});

function clear() {
  return dispatch => dispatch({
    type: `${coreName}_FIND_FULFILLED`,
    payload: null,
  });
}

export default {
  actions: {
    ...province.actions,
    generalInfo: {
      update: generalInfo.actions.create,
    },
    publications: publications.actions,
    links: links.actions,
    userPic: {
      update: userPic.actions.create,
    },
    clear,
  },
  reducer: province.reducer,
};
