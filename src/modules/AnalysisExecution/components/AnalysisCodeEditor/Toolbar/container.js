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
 * Created: December 22, 2016
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import Toolbar from './presenter';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/AnalysisExecution/const';
import { analysisPermissions } from 'modules/AnalysisExecution/const';

function mapStateToProps(state) {
  const analysisCodeData = get(state, 'analysisExecution.analysisCode.data.result');
  const breadcrumbs = get(state, 'analysisExecution.breadcrumbs.queryResult.result');
  const isWorkspace = get(state, 'modules.active') === 'workspace';

  const breadcrumbList = buildBreadcrumbList(breadcrumbs, isWorkspace);
  const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;

  return {
    title: get(analysisCodeData, 'label') || get(analysisCodeData, 'name'),
    backUrl,
    breadcrumbList,
    isEditable: get(analysisCodeData, `permissions[${analysisPermissions.deleteAnalysisFiles}]`, false),
  };
}

const mapDispatchToProps = {
  openEditFileNameModal: () => ModalUtils.actions.toggle(modal.editFileName, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
