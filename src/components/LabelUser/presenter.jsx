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
 * Created: July 25, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Link,
  Avatar,
} from 'arachne-ui-components';
import {
  paths as expertPaths,
  apiPaths as expertApiPaths
} from 'modules/ExpertFinder/const';

require('./style.scss');

function LabelUser(props) {
  const classes = new BEMHelper('user-label');
  const {
    mods,
    user = {},
    remove,
    showAvatar = true,
  } = props;

  return (
    <div {...classes({ modifiers: mods })}>
      {showAvatar &&
        <div {...classes('userpic')}>
          <Avatar img={expertApiPaths.userpic({ id: user.id })} mods="round" />
        </div>
      }
      <div {...classes('name')}>
        <Link to={expertPaths.profile(user.id)}>
          {user.name}
        </Link>
        {user.subtitle}
      </div>
    </div>
  );
}

function userInfoConvert(data) {
  return {
    ...data,
    name: `${data.firstname} ${data.middlename ? (data.middlename + ' ') : ''} ${data.lastname}`,
  };
}

export default LabelUser;
export {
  userInfoConvert,
};
