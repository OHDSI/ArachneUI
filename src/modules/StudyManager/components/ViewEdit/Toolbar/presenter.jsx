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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Toolbar } from 'arachne-ui-components';
import Actions from '../Actions/index';

require('./style.scss');

function StudyToolbar(props) {
  const {
    breadcrumbList,
    backurl,
    isEditable,
    openEditTitleModal,
    studyTitle,
    isFavourite,
    setFavourite,
  } = props;

  const classes = new BEMHelper('study-toolbar-title');

  return (
    <Toolbar
      caption={<div {...classes()}>
        <span {...classes('title')} id="study-title">{studyTitle}</span>
        <span {...classes({ element: 'fav-icon', modifiers: { marked: isFavourite } })} onClick={setFavourite}>
          {isFavourite ? 'star' : 'star_border'}
        </span>
      </div>}
      onEdit={isEditable ? openEditTitleModal : null}
      isEditable={isEditable}
      breadcrumbList={breadcrumbList}
      backUrl={backurl}
    >
      <Actions />
    </Toolbar>
  );
}

StudyToolbar.propTypes = {
  breadcrumbList: PropTypes.array.isRequired,
  backurl: PropTypes.string,
  isEditable: PropTypes.bool.isRequired,
  openEditTitleModal: PropTypes.func.isRequired,
  studyTitle: PropTypes.string.isRequired,
  isFavourite: PropTypes.bool,
  setFavourite: PropTypes.func,
}

export default StudyToolbar;
