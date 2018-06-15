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
 * Created: February 07, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function AttributesListItem({ label, value }) {
  const itemClasses = new BEMHelper('attributes-list-item');

  return (
    <div {...itemClasses()}>
      <div {...itemClasses('name')}>
        {label}
      </div>
      <div {...itemClasses('value')}>
        {value}
      </div>
    </div>
  );
}

function AttributesList({ attrList, attrValues }) {
  const classes = new BEMHelper('attributes-list');

  return (
    <div className="row">
      <div className='col-xs-6 col-md-6'>
        <div {...classes()}>
          {attrList.filter(item => attrValues[item.name]).map((item, key) =>
            <AttributesListItem label={item.label} value={attrValues[item.name]} key={key} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AttributesList;
