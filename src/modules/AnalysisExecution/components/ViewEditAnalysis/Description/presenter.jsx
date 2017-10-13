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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { PanelEditable } from 'arachne-ui-components';
import ViewContent from './View/index';
import EditContent from './Edit/index';

require('./style.scss');

function Description({ isEditable }) {
  const classes = new BEMHelper('analysis-description');

  return (
    <PanelEditable
      {...classes()}
      title="Description"
      isEditable={isEditable}
      viewContent={<ViewContent />}
      editContent={<EditContent />}
    />
  );
}

export default Description;
