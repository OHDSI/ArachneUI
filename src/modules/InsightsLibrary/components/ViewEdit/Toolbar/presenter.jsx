/*
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
 * Created: July 19, 2017
 *
 */

import React, { PropTypes } from 'react';
import {
  Toolbar,
} from 'arachne-ui-components';
import TitleLabeled from 'components/TitleLabeled';
import { get } from 'services/Utils';
import { publishStateOptions } from 'modules/InsightsLibrary/const';
import ToolbarActions from './ToolbarActions';

function ViewEditInsightToolbar(props) {
  const {
    backUrl,
    breadcrumbList,
    name,
    selectedPublishState,
  } = props;
  const title = <TitleLabeled
    title={name}
    label={selectedPublishState.value === 'DRAFT' ? 'DRAFT' : null}
    labelDescr={get(publishStateOptions.filter(opt => opt.value === 'DRAFT')[0], 'tooltip')}
  />;

  return (
    <Toolbar
      caption={title}
      backUrl={backUrl}
      breadcrumbList={breadcrumbList}
    >
      <ToolbarActions />
    </Toolbar>
  );
}

ViewEditInsightToolbar.propTypes = {
  backUrl: PropTypes.string,
  breadcrumbList: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  selectedPublishState: PropTypes.object,
};

export default ViewEditInsightToolbar;
