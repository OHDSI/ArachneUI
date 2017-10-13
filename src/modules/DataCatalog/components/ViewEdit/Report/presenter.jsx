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

import { reports as reportConst } from 'modules/DataCatalog/const';

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
  }
}

require('./style.scss');

function Report(props) {
  const {
    list,
    selectedReport,
    isLoading,
    selectReport,
    dataSourceUuid,
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
        {...classes('select')}
      />
      {reports.Dashboard && selectedReport === reportConst.DASHBOARD &&
        <reports.Dashboard />
      }
      {reports.Person && selectedReport === reportConst.PERSON &&
        <reports.Person />
      }
      {reports.ObservationPeriods && selectedReport === reportConst.OBSERVATION_PERIODS &&
        <reports.ObservationPeriods />
      }
      {reports.DataDensity && selectedReport === reportConst.DATA_DENSITY &&
        <reports.DataDensity />
      }
      {reports.Death && selectedReport === reportConst.DEATH &&
        <reports.Death />
      }
      {reports.Conditions && selectedReport === reportConst.CONDITIONS &&
        <reports.Conditions dataSourceUuid={dataSourceUuid} />
      }
      {reports.ConditionEra && selectedReport === reportConst.CONDITIONERA &&
        <reports.ConditionEra dataSourceUuid={dataSourceUuid} />
      }
      {reports.Observations && selectedReport === reportConst.OBSERVATIONS &&
        <reports.Observations dataSourceUuid={dataSourceUuid} />
      }
      {reports.DrugEra && selectedReport === reportConst.DRUGERA &&
        <reports.DrugEra dataSourceUuid={dataSourceUuid} />
      }
      {reports.Drug && selectedReport === reportConst.DRUG &&
        <reports.Drug dataSourceUuid={dataSourceUuid} />
      }
      {reports.Procedures && selectedReport === reportConst.PROCEDURES &&
        <reports.Procedures dataSourceUuid={dataSourceUuid} />
      }
      {reports.Visits && selectedReport === reportConst.VISITS &&
        <reports.Visits dataSourceUuid={dataSourceUuid} />
      }
      {reports.Achillesheel && selectedReport === reportConst.ACHILLESHEEL &&
        <reports.Achillesheel />
      }
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Report;

