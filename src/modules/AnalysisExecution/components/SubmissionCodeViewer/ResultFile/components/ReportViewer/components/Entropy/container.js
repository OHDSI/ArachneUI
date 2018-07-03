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
 * Created: November 21, 2017
 *
 */


import { ContainerBuilder } from 'services/Utils';
import {
  convertDataToLineChartData,
} from 'components/Reports/converters';
import {
	line,
} from '@ohdsi/atlascharts';
import { BaseChart } from 'components/Reports/BaseChart';
import presenter from './presenter';

class EntropyReport extends BaseChart {
  constructor(props) {
    super(props);
    this.charts = [this.props.lineChart];
  }

  render() {
    return presenter(this.props);
  }
}

const entropyDTO = {
  xValue: 'date',
  yValue: 'entropy',
  yPercent: 'entropy',
};

export default class EntropyReportBuilder extends ContainerBuilder {
  constructor() {
    super();
    this.lineChart = new line();
  }

  getComponent() {
    return EntropyReport;
  }

  mapStateToProps(state, ownProps) {
    const {
      entropy,
    } = ownProps;

    const data = convertDataToLineChartData(
      entropy,
      entropyDTO
    );

    return {
      data,
      lineChart: this.lineChart,
    };
  }
}
