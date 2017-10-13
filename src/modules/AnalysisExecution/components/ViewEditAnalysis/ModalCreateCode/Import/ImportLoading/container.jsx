/**
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
 * Created: July 26, 2017
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import CohortLoading from './presenter';

function mapStateToProps(state, ownProps) {  
  const analysisType = get(state, 'analysisExecution.analysis.data.result.type.id', '', 'String');

  return {
    totalSteps: ownProps.totalSteps,
    step: ownProps.step,
    selectedSource: get(
      ownProps,
      'selectedSource',
      {},
      'Object'
    ),
    goBack: ownProps.goBack,
    analysisType,
  };
}

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortLoading);
