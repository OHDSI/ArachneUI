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
 * Created: May 05, 2017
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths, breadcrumbTypes } from 'modules/AnalysisExecution/const';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import InsightToolbar from './presenter';

function mapStateToProps(state) {
  const insightData = get(state, 'analysisExecution.insight.data.result');
  const analysisId = get(insightData, 'analysis.id');
  const analysisTitle = get(insightData, 'analysis.title');
  const studyId = get(insightData, 'analysis.study.id');
  const studyTitle = get(insightData, 'analysis.study.title');
  const analysisUrl = paths.analyses(analysisId);
  const isWorkspace = get(state, 'modules.active') === 'workspace';
  const breadcrumbList = buildBreadcrumbList(
    [
      {
        entityType: breadcrumbTypes.STUDY,
        title: studyTitle,
        id: studyId,
      },
      {
        entityType: breadcrumbTypes.ANALYSIS,
        title: analysisTitle,
        id: analysisUrl,
      },
    ],
    !isWorkspace
  );  

  return {
    insightTitle: get(insightData, 'name'),
    backUrl: analysisUrl,
    breadcrumbList,
  };
}

const mapDispatchToProps = {
  editTitle: () => ModalUtils.actions.toggle(modal.editInsightTitle, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightToolbar);
