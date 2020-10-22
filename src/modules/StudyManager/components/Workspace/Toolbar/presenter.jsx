/*
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
 * Authors: Anton Gackovka
 * Created: June 4, 2018
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Toolbar, Button, Avatar, Link } from 'arachne-ui-components';
import { apiPaths, paths } from 'modules/StudyManager/const';

require('./style.scss');

function UserAvatar({ url }) {
  const classes = new BEMHelper('workspace-user-avatar');

  return (
    <div {...classes()}>
      <Avatar mods={['round', 'bordered']} img={url}/>
    </div>
  );
}

function TitleCaption({ title }) {
  
  const classes = new BEMHelper('workspace-toolbar-title-caption');
  
  return (
    <div {...classes()}>
      <div {...classes('info')}>
        <span {...classes('title')}>
          {title}
        </span>
      </div>
    </div>
  )
}

function WorkspaceToolbar(props) {
  const {
    reload,
    toolbarSettings,
    breadcrumbList,
  } = props;

  const classes = new BEMHelper('workspace-toolbar-title');

  return (
    <Toolbar
      caption={<TitleCaption {...toolbarSettings}/>}
      breadcrumbList={breadcrumbList}
      icon={<UserAvatar url={apiPaths.userpic(toolbarSettings.userId)}/>}
    >
      <Button {...classes('reload')} onClick={reload}>
        <i {...classes('reload-ico')}>refresh</i>
      </Button>
    </Toolbar>
  );
}

WorkspaceToolbar.propTypes = {
  breadcrumbList: PropTypes.array.isRequired,
  backurl: PropTypes.string,
  isEditable: PropTypes.bool,
  openEditTitleModal: PropTypes.func,
  studyTitle: PropTypes.string,
  isFavourite: PropTypes.bool,
  setFavourite: PropTypes.func,
};

export default WorkspaceToolbar;
