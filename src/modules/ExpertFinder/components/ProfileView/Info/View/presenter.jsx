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

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function BasicInfoView({  professionalType, affiliation  }) {
	const classes = new BEMHelper('profile-info-view');

  return (
  	<div {...classes('content')}>
       <div {...classes({ element: 'info-attribute', modifiers: { empty: !professionalType.name } })}>
         {professionalType.name || 'Professional type'}
       </div>
       <div {...classes({ element: 'info-attribute', modifiers: { empty: !affiliation } })}>
         {affiliation || 'Affiliation'}
       </div>
     </div>
  );
}

BasicInfoView.PropTypes = {
  professionalType: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  affiliation: PropTypes.string,
};

export default BasicInfoView;
