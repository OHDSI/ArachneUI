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
 * Created: December 13, 2016
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths, breadcrumbTypes } from 'modules/AnalysisExecution/const';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import Toolbar from './presenter';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const studyTitle = get(analysisData, 'study.title');
  const studyUrl = paths.studies(
    get(analysisData, 'study.id')
  );
  const author = get(analysisData, 'author', {});
  const isLoading = get(state, 'analysisExecution.analysis.isLoading', false);
  const isWorkspace = get(state, 'modules.active') === 'workspace';
  const breadcrumbList = buildBreadcrumbList(
    [
      {
        entityType: breadcrumbTypes.STUDY,
        title: studyTitle,
        id: get(analysisData, 'study.id'),
      },
    ],
    !isWorkspace
  );

  return {
    analysisTitle: get(analysisData, 'title'),
    backUrl: studyUrl,
    createdAt: get(analysisData, 'created'),
    breadcrumbList,
    studyTitle,
    author,
    isLoading,
  };
}

const mapDispatchToProps = {
  editTitle: () => ModalUtils.actions.toggle(modal.editAnalysisTitle, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
