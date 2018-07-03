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
 * Created: September 08, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import ActionsBuilder from './actions';

require('./style.scss');

export default function ToolbarActions(props) {
  const classes = new BEMHelper('insight-view-toolbar-actions');

  return (
    <ul {...classes()}>
      {new ActionsBuilder(props, classes).build()}
    </ul>
  );
}

ToolbarActions.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  remove: PropTypes.func,
  openSettings: PropTypes.func,
  selectedPublishState: PropTypes.object,
};
