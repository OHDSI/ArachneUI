/*
 *  Copyright 2017 Observational Health Data Sciences and Informatics
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Company: Odysseus Data Services, Inc.
 *  Product Owner/Architecture: Gregory Klebanov
 *  Authors: Anton Gackovka
 *  Created: October 18, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Link, Toolbar } from 'arachne-ui-components';

require('./style.scss');

function CodeToolbar(props) {
  const classes = new BEMHelper('file-toolbar');
  const {
    title,
    backUrl,
    breadcrumbList,
  } = props;

  return (
    <Toolbar {...classes()}
      mods={['sm-block-spacing']}
      caption={title}
      breadcrumbList={breadcrumbList}
      backUrl={backUrl}
    />
  );
}

CodeToolbar.propTypes = {
  backUrl: PropTypes.string.isRequired,
  breadcrumbList: PropTypes.array,
};

export default CodeToolbar;
