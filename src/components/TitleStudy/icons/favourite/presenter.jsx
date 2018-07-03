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
 * Created: September 15, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import classnames from 'classnames';

require('./style.scss');

function IconFavourite({ className, isFavourite, toggleFavorite } = {}) {
  const classes = new BEMHelper('title-study-ico-fav');
  const tooltipClass = new BEMHelper('tooltip');

  const classesParams = {
    modifiers: { marked: isFavourite },
    extra: classnames(tooltipClass().className, className),
  };

  return (
    <div
      {...classes(classesParams)}
      aria-label={isFavourite ? 'Remove from favorites' : 'Mark as favorite'}
      data-tootik-conf="right"
      onClick={(evt) => {
        if (toggleFavorite) {
          evt.stopPropagation();
          toggleFavorite();
        }
      }}
    >
      {isFavourite ? 'star' : 'star_border'}
    </div>
  );
}

export default IconFavourite;
