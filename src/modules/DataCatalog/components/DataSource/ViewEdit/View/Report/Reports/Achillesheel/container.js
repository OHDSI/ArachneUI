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
 * Created: June 13, 2017
 *
 */

import { connect } from 'react-redux';
import { get } from 'services/Utils';
import { convertDataToHeelData } from 'components/Reports/converters';
import Achillesheel from './presenter';

function mapStateToProps(state) {
  const reportData = get(state, 'dataCatalog.report.data.result', {});
  const data = reportData.MESSAGES
        ? convertDataToHeelData(reportData.MESSAGES)
        : [];

  const columns = {
    type: 'Message type',
    message: 'Message',
  };

  return {
    data,
    columns,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Achillesheel);
