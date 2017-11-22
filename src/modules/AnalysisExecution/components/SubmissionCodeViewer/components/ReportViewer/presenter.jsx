/*
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
 * Authors: Alexander Saltykov
 * Created: November 20, 2017
 *
 */

import React, { PropTypes } from 'react';
import { canUseDom } from 'services/Utils';
import BEMHelper from 'services/BemHelper';
import {
  PageContent,
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
    toolbarOpts,
    // for treemap reports only
    loadTreemapDetails,
    tableData,
    tableColumns,
    details,
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

  return (
    <PageContent title={pageTitle}>
      <div {...classes()}>
        <Toolbar params={toolbarOpts} />
        <ActionBar downloadLink={downloadLink} />
        <div {...classes('content')}>
          {reports.Dashboard && type === reportTypes.DASHBOARD &&
            <reports.Dashboard
              showSummary={false}
              ageAtFirstObservation={{
                DATA: data.ageAtDeath,
                INTERVALS: data.ageAtDeath.INTERVAL_INDEX.length - 1,
                INTERVAL_SIZE: 1,
                MAX: data.ageAtDeath.INTERVAL_INDEX.length - 1,
                MIN: 0,
              }}
              cumulativeDuration={data.cumulativeDuration}
              genderData={data.gender}
              observedByMonth={data.observedByMonth}
            />
          }
          {reports.Person && type === reportTypes.PERSON &&
            <reports.Person
              showSummary={false}
              birthYear={{
                DATA: data.yearOfBirthData,
                INTERVALS: data.yearOfBirthData.INTERVAL_INDEX.length - 1,
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
          {reports.ObservationPeriods && type === reportTypes.OBSERVATION_PERIODS &&
            <reports.ObservationPeriods
              ageAtFirstObservation={{
                DATA: data.ageAtFirst,
                INTERVALS: data.ageAtFirst.INTERVAL_INDEX.length - 1,
                INTERVAL_SIZE: 1,
                MAX: data.ageAtFirst.INTERVAL_INDEX.length - 1,
                MIN: 0,
              }}
              ageByGender={data.ageByGender}
              durationByGender={data.observationLengthByGender}
              observationLength={{
                DATA: data.observationLengthData,
                INTERVALS: data.observationLengthData.INTERVAL_INDEX.length - 1,
                INTERVAL_SIZE: 1,
                MAX: data.observationLengthData.INTERVAL_INDEX.length - 1,
                MIN: 0,
              }}
              cumulativeObservation={data.cumulativeDuration}
              durationByAgeDecline={data.observationLengthByAge}
              durationByYear={{
                DATA: data.observedByYearData,
                INTERVALS: data.observedByYearData.INTERVAL_INDEX.length - 1,
                INTERVAL_SIZE: 1,
                MAX: data.observedByYearData.INTERVAL_INDEX.length - 1,
                MIN: 0,
              }}
              observationsPerPerson={data.periodPerPerson}
              observationsByMonth={data.observedByMonth}
            />
          }
          {reports.DataDensity && type === reportTypes.DATA_DENSITY &&
            <reports.DataDensity
              conceptsPerPerson={data.conceptsPerPerson}
              recordsPerPerson={data.recordsPerPerson}
              totalRecords={data.totalRecords}
            />
          }
          {reports.Death && type === reportTypes.DEATH &&
            <reports.Death
              ageOfDeath={data.ageAtDeath}
              deathByAge={data.prevalenceByGenderAgeYear}
              deathByMonth={data.prevalenceByMonth}
              deathByType={data.deathByType}
            />
          }
          {reports.Observations && type === reportTypes.OBSERVATIONS &&
            <reports.Observations {...treemapParams} />
          }
          {reports.DrugEra && type === reportTypes.DRUGERA &&
            <reports.DrugEra {...treemapParams} />
          }
          {reports.ConditionEra && type === reportTypes.CONDITIONERA &&
            <reports.ConditionEra {...treemapParams} />
          }
          {reports.Procedures && type === reportTypes.PROCEDURES &&
            <reports.Procedures {...treemapParams} />
          }
          {reports.Visits && type === reportTypes.VISITS &&
            <reports.Visits {...treemapParams} />
          }
          {reports.Conditions && type === reportTypes.CONDITIONS &&
            <reports.Conditions {...treemapParams} />
          }
          {reports.Cohortspecific && type === reportTypes.COHORTPECIFIC &&
            <reports.Cohortspecific {...data} />
          }
          {reports.Heraclesheel && type === reportTypes.HERACLESHEEL &&
            <reports.Heraclesheel reportData={data} />
          }
          {reports.ProceduresByIndex && type === reportTypes.PROCEDURES_BY_INDEX &&
            <reports.ProceduresByIndex {...treemapParams} />
          }
          {reports.ConditionsByIndex && type === reportTypes.CONDITIONS_BY_INDEX &&
            <reports.ConditionsByIndex {...treemapParams} />
          }
          {reports.DataCompleteness && type === reportTypes.DATA_COMPLETENESS &&
            <reports.DataCompleteness {...data} />
          }
          {reports.Entropy && type === reportTypes.ENTROPY &&
            <reports.Entropy {...data} />
          }
        </div>
      </div>
    </PageContent>
  );
}

ReportViewer.propTypes = {
};

export default ReportViewer;
