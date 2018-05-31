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
import { Link } from 'arachne-ui-components';

require('./style.scss');

function LinkListItem({
  description,
  editable,
  id,
  onRemove,
  title,
  link,
  onClick,
}) {
  const classes = new BEMHelper('profile-link-list-item');

  return (
    <div {...classes()}>
      <div {...classes('item-data')}>
        <Link to={link} onClick={onClick}>
          {title}
        </Link>
        {description &&
          <p {...classes('description')}>{description}</p>
  			}
        </div>
      {editable && 
        <div>
          <Link {...classes('remove-button')} onClick={() => onRemove(id)}>close</Link>
        </div>
      }
    </div>
  );
}

LinkListItem.PropTypes = {
  description: PropTypes.string,
  editable: PropTypes.bool,
  id: PropTypes.number,
  onRemove: PropTypes.func,
  title: PropTypes.string,
  url: PropTypes.string,
};
export default LinkListItem;
