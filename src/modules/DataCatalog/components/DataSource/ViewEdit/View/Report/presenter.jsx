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
 * Created: May 29, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { canUseDom } from 'services/Utils';
import {
  Panel,
  Select,
  LoadingPanel,
} from 'arachne-ui-components';

import { reports as reportConst } from 'const/reports';

let reports = {};

if (canUseDom()) {
  reports = {
    Achillesheel: require('./Reports/Achillesheel').default,
    ConditionEra: require('./Reports/ConditionEra').default,
    Conditions: require('./Reports/Conditions').default,
    Dashboard: require('./Reports/Dashboard').default,
    DataDensity: require('./Reports/DataDensity').default,
    Death: require('./Reports/Death').default,
    Drug: require('./Reports/Drug').default,
    DrugEra: require('./Reports/DrugEra').default,
    ObservationPeriods: require('./Reports/ObservationPeriods').default,
    Observations: require('./Reports/Observations').default,
    Person: require('./Reports/Person').default,
    Procedures: require('./Reports/Procedures').default,
    Visits: require('./Reports/Visits').default,
    Measurement: require('./Reports/Measurement').default,
  }
}

require('./style.scss');

function Report(props) {
  const {
    list,
    selectedReport,
    isLoading,
    selectReport,
    dataSourceId,
  } = props;
  const classes = new BEMHelper('data-source-report');

  return (
    <div {...classes()}>
      <Select
        options={list.map(report => ({
          value: report.label,
          label: report.name,
        }))}
        onChange={selectReport}
        value={selectedReport}
        unselectable={false}
        {...classes('select')}
      />
      {reports.Dashboard && selectedReport === reportConst.dashboard &&
        <reports.Dashboard />
      }
      {reports.Person && selectedReport === reportConst.person &&
        <reports.Person />
      }
      {reports.ObservationPeriods && selectedReport === reportConst.observationperiods &&
        <reports.ObservationPeriods />
      }
      {reports.DataDensity && selectedReport === reportConst.datadensity &&
        <reports.DataDensity />
      }
      {reports.Death && selectedReport === reportConst.death &&
        <reports.Death />
      }
      {reports.Conditions && selectedReport === reportConst.conditions &&
        <reports.Conditions dataSourceId={dataSourceId} />
      }
      {reports.ConditionEra && selectedReport === reportConst.conditionera &&
        <reports.ConditionEra dataSourceId={dataSourceId} />
      }
      {reports.Observations && selectedReport === reportConst.observations &&
        <reports.Observations dataSourceId={dataSourceId} />
      }
      {reports.DrugEra && selectedReport === reportConst.drugeras &&
        <reports.DrugEra dataSourceId={dataSourceId} />
      }
      {reports.Drug && selectedReport === reportConst.drugexposures &&
        <reports.Drug dataSourceId={dataSourceId} />
      }
      {reports.Procedures && selectedReport === reportConst.procedures &&
        <reports.Procedures dataSourceId={dataSourceId} />
      }
      {reports.Visits && selectedReport === reportConst.visits &&
        <reports.Visits dataSourceId={dataSourceId} />
      }
      {reports.Visits && selectedReport === reportConst.measurement &&
        <reports.Measurement dataSourceId={dataSourceId} />
      }
      {reports.Achillesheel && selectedReport === reportConst.achillesheel &&
        <reports.Achillesheel />
      }
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Report;

