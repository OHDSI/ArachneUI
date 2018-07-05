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
 * Authors: Alexander Saltykov
 * Created: November 17, 2017
 *
 */

import { ContainerBuilder, get } from 'services/Utils';
import { convertDataToHeelData } from 'components/Reports/converters';
import Heraclesheel from './presenter';

export default class HeraclesheelBuilder extends ContainerBuilder {
  getComponent() {
    return Heraclesheel;
  }

  mapStateToProps(state, ownProps) {
    const rawData = get(ownProps, 'reportData.heraclesHeel', []);
    const data = rawData
          ? convertDataToHeelData(rawData, { valueField: 'ATTRIBUTE_VALUE' })
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

  getMapDispatchToProps() {
    return {};
  }
}
