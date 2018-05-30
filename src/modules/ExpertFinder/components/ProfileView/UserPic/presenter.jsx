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
 * Created: January 16, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';
import { Button } from 'arachne-ui-components';
import { Avatar } from 'arachne-ui-components';

require('./style.scss');

function UserPic(props) {
  const {
    userpic,
    editable,
  } = props;
  const classes = new BEMHelper('profile-userpic');

  return (
    <div {...classes()}>
      <Avatar img={userpic}/>
      {editable && 
      	<Button {...classes('add-button')} onClick={props.showUploadForm}>Add photo</Button>
      }
    </div>
  );
}

UserPic.PropTypes = {
	editable: PropTypes.bool,
  image: PropTypes.string,
};
export default UserPic;
