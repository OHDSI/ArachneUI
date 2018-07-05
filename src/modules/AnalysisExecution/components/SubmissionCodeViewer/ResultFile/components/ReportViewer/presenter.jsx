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
 * Created: November 20, 2017
 *
 */

import React, { PropTypes } from 'react';
import { canUseDom, get } from 'services/Utils';
import BEMHelper from 'services/BemHelper';
import {
  PageContent,
  LoadingPanel,
} from 'arachne-ui-components';
import { reports as reportTypes } from 'const/reports';
import Toolbar from 'components/FileViewer/Toolbar/index';
import { ActionBar } from 'components/MediaViewer/presenter';

let reports = {};

if (canUseDom()) {
  reports = {
    Dashboard: require('components/Reports/Dashboard').default,
    DataDensity: require('components/Reports/DataDensity').default,
    Death: require('components/Reports/Death').default,
    Drug: require('components/Reports/Drug').default,
    DrugEra: require('components/Reports/DrugEra').default,
    ObservationPeriods: require('components/Reports/ObservationPeriods').default,
    Observations: require('components/Reports/Observations').default,
    Person: require('components/Reports/Person').default,
    Procedures: require('components/Reports/Procedures').default,
    Visits: require('components/Reports/Visits').default,
    Conditions: require('components/Reports/Conditions').default,
    ConditionEra: require('components/Reports/ConditionEra').default,

    Cohortspecific: require('./components/Cohortspecific').default,
    Heraclesheel: require('./components/Heraclesheel').default,
    ProceduresByIndex: require('./components/ProceduresByIndex').default,
    ConditionsByIndex: require('./components/ConditionsByIndex').default,
    DrugByIndex: require('./components/DrugByIndex').default,
    DataCompleteness: require('./components/DataCompleteness').default,
    Entropy: require('./components/Entropy').default,
  };
}

require('./style.scss');

function ReportViewer(props) {
  const classes = new BEMHelper('report-viewer');
  const {
    type,
    data,
    downloadLink,
    pageTitle,
    // for treemap reports only
    loadTreemapDetails,
    tableData,
    tableColumns,
    details,
    isDetailsLoading,
    title,
    createdAt,
  } = props;

  const treemapParams = {
    conditions: data,
    loadDetails: loadTreemapDetails,
    details,
    onZoom: () => {},
    initialZoomedConcept: null,
    tableData,
    tableColumns,
    getFilename: conceptId => conceptId,
  };

  const getIntervalIndexLength = (path) => get(data, `${path}.INTERVAL_INDEX.length`, 0) - 1;

  return (
    <PageContent title={pageTitle}>
      <div {...classes()}>
        <ActionBar downloadLink={downloadLink} title={title} createdAt={createdAt} />
        <div {...classes('content')}>
          {reports.Dashboard && type === reportTypes.dashboard &&
            <reports.Dashboard
              showSummary={false}
              ageAtFirstObservation={{
                DATA: data.ageAtDeath,
                INTERVALS: getIntervalIndexLength('ageAtDeath'),
                INTERVAL_SIZE: 1,
                MAX: data.ageAtDeath.INTERVAL_INDEX.length - 1,
                MIN: 0,
              }}
              cumulativeDuration={data.cumulativeDuration}
              genderData={data.gender}
              observedByMonth={data.observedByMonth}
            />
          }
          {reports.Person && type === reportTypes.person &&
            <reports.Person
              showSummary={false}
              birthYear={{
                DATA: data.yearOfBirthData,
                INTERVALS: getIntervalIndexLength('yearOfBirthData'),
                INTERVAL_SIZE: 1,
                MAX: data.yearOfBirthStats.MAX_VALUE[0],
                MIN: data.yearOfBirthStats.MIN_VALUE[0],
              }}
              ethnicity={data.ethnicity}
              genderData={data.gender}
              race={data.race}
              summary={null}
            />
          }
          {reports.ObservationPeriods && type === reportTypes.observationperiods &&
            <reports.ObservationPeriods
              ageAtFirstObservation={{
                DATA: data.ageAtFirst,
                INTERVALS: getIntervalIndexLength('ageAtFirst'),
                INTERVAL_SIZE: 1,
                MAX: getIntervalIndexLength('ageAtFirst'),
                MIN: 0,
              }}
              ageByGender={data.ageByGender}
              durationByGender={data.observationLengthByGender}
              observationLength={{
                DATA: data.observationLengthData,
                INTERVALS: getIntervalIndexLength('observationLengthData'),
                INTERVAL_SIZE: 1,
                MAX: getIntervalIndexLength('observationLengthData'),
                MIN: 0,
              }}
              cumulativeObservation={data.cumulativeDuration}
              durationByAgeDecline={data.observationLengthByAge}
              durationByYear={{
                DATA: data.observedByYearData,
                INTERVALS: getIntervalIndexLength('observedByYearData'),
                INTERVAL_SIZE: 1,
                MAX: getIntervalIndexLength('observedByYearData'),
                MIN: 0,
              }}
              observationsPerPerson={data.periodPerPerson}
              observationsByMonth={data.observedByMonth}
            />
          }
          {reports.DataDensity && type === reportTypes.datadensity &&
            <reports.DataDensity
              conceptsPerPerson={data.conceptsPerPerson}
              recordsPerPerson={data.recordsPerPerson}
              totalRecords={data.totalRecords}
            />
          }
          {reports.Death && type === reportTypes.death &&
            <reports.Death
              ageOfDeath={data.ageAtDeath}
              deathByAge={data.prevalenceByGenderAgeYear}
              deathByMonth={data.prevalenceByMonth}
              deathByType={data.deathByType}
            />
          }
          {reports.Observations && type === reportTypes.observations &&
            <reports.Observations {...treemapParams} />
          }
          {reports.DrugEra && type === reportTypes.drugeras &&
            <reports.DrugEra {...treemapParams} />
          }
          {reports.ConditionEra && type === reportTypes.conditionera &&
            <reports.ConditionEra {...treemapParams} />
          }
          {reports.Procedures && type === reportTypes.procedures &&
            <reports.Procedures {...treemapParams} />
          }
          {reports.Visits && type === reportTypes.visits &&
            <reports.Visits {...treemapParams} />
          }
          {reports.Conditions && type === reportTypes.conditions &&
            <reports.Conditions {...treemapParams} />
          }
          {reports.Cohortspecific && type === reportTypes.cohortspecific &&
            <reports.Cohortspecific {...data} />
          }
          {reports.Heraclesheel && type === reportTypes.heraclesheel &&
            <reports.Heraclesheel reportData={data} />
          }
          {reports.ProceduresByIndex && type === reportTypes.procbyindex &&
            <reports.ProceduresByIndex {...treemapParams} />
          }
          {reports.ConditionsByIndex && type === reportTypes.condbyindex &&
            <reports.ConditionsByIndex {...treemapParams} />
          }
          {reports.DrugByIndex && type === reportTypes.drugbyindex &&
            <reports.DrugByIndex {...treemapParams} />
          }
          {reports.DataCompleteness && type === reportTypes.datacompleteness &&
            <reports.DataCompleteness {...data} />
          }
          {reports.Entropy && type === reportTypes.entropy &&
            <reports.Entropy {...data} />
          }
        </div>
      </div>
      <LoadingPanel
        active={isDetailsLoading}
        label={'Loading drilldown'}
      />
    </PageContent>
  );
}

ReportViewer.propTypes = {
};

export default ReportViewer;
