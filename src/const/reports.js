const reports = {
  DASHBOARD: 'dashboard',
  PERSON: 'person',
  OBSERVATION_PERIODS: 'observationperiods',
  DATA_DENSITY: 'datadensity',
  DEATH: 'death',
  CONDITIONS: 'conditions',
  CONDITIONERA: 'conditioneras',
  OBSERVATIONS: 'observations',
  DRUGERA: 'drugeras',
  DRUG: 'drugexposures',
  PROCEDURES: 'procedures',
  VISITS: 'visits',
  ACHILLESHEEL: 'achillesheel',
  UNKNOWN: 'unknown',
  // Cohort characterization-specific
  COHORTPECIFIC: 'cohortspecific',
};

const chartTypes = {
  BOXPLOT: 'boxplot',
  HISTOGRAM: 'histogram',
  DONUT: 'donut',
  LINE: 'line',
  LINE_DATA: 'line_data',
  LINE_METADATA: 'line_metadata',
  LINE_W_LEGEND: 'line_w_legend',
  LINE_DATA_BY_MONTH: 'line_data_by_month',
  TRELLISLINE: 'trellisline',
  TREEMAP: 'treemap',
};

const chartFootprints = {
  [chartTypes.DONUT]: `
    CONCEPT_ID: Number,
    COUNT_VALUE: Number,
    CONCEPT_NAME: String
  `,
  [chartTypes.BOXPLOT]: `
    CATEGORY: String,
    MIN_VALUE: Number,
    P10_VALUE: Number,
    P25_VALUE: Number,
    MEDIAN_VALUE: Number,
    P75_VALUE: Number,
    P90_VALUE: Number,
    MAX_VALUE: Number,
    CONCEPT_ID: Number
  `,
  [chartTypes.TRELLISLINE]: `
    TRELLIS_NAME: String,
    SERIES_NAME: String,
    X_CALENDAR_YEAR: String,
    Y_PREVALENCE_1000PP: Float,
    NUM_PERSONS: Number
  `,
  [chartTypes.LINE_METADATA]: `
    MIN_VALUE: Number,
    MAX_VALUE: Number,
    INTERVAL_SIZE: Number
  `,
  [chartTypes.LINE_DATA]: `
    INTERVAL_INDEX: Number,
    COUNT_VALUE: Number,
    PERCENT_VALUE: Float | Number
  `,
  [chartTypes.LINE_DATA_BY_MONTH]: `
    MONTH_YEAR: Number,
    COUNT_VALUE: Number,
    PERCENT_VALUE: Float | Number
  `,
  [chartTypes.LINE]: `
    SERIES_NAME: String,
    X_LENGTH_OF_OBSERVATION: Number,
    Y_PERCENT_PERSONS: Float | Number
  `,
  [chartTypes.LINE_DATA_W_LEGEND]: `
    SERIES_NAME: String,
    X_CALENDAR_MONTH: String,
    Y_RECORD_COUNT: Float | Number
  `,
  [chartTypes.TREEMAP]: `
    CONCEPT_ID: Number,
    CONCEPT_PATH: String,
    NUM_PERSONS: Number,
    PERCENT_PERSONS: Float | Number,
    RECORDS_PER_PERSON: Float | Number
  `,
};
chartFootprints[chartTypes.HISTOGRAM] = `
  ${chartFootprints[chartTypes.LINE_METADATA]},
  DATA: [{ ${chartFootprints[chartTypes.LINE_DATA]} }]
`;

const reportFootprints = {
  [reports.DASHBOARD]: `{
    ageAtDeath: [{ ${chartFootprints[chartTypes.LINE_DATA]} }],
    gender: [{ ${chartFootprints[chartTypes.DONUT]} }],
    cumulativeDuration: [{ ${chartFootprints[chartTypes.LINE]} }],
    observedByMonth: [{ ${chartFootprints[chartTypes.LINE_DATA_BY_MONTH]} }]
  }`,
  [reports.DEATH]: `{
    ageAtDeath: [{ ${chartFootprints[chartTypes.BOXPLOT]} }],
    deathByType: [{ ${chartFootprints[chartTypes.DONUT]} }],
    prevalenceByGenderAgeYear: [{ ${chartFootprints[chartTypes.TRELLISLINE]} }],
    prevalenceByMonth: [
      {
        X_CALENDAR_MONTH: String,
        Y_PREVALENCE_1000PP: Float,
        CONCEPT_ID: Number
      }
    ]
  }`,
  [reports.OBSERVATION_PERIODS]: `{
    ageAtFirst: [{ ${chartFootprints[chartTypes.LINE_DATA]} }],
    observationLengthData: [{ ${chartFootprints[chartTypes.LINE_DATA]} }],
    observationLengthStats: [{ ${chartFootprints[chartTypes.LINE_METADATA]} }],
    observedByYearData: [{ ${chartFootprints[chartTypes.LINE_DATA]} }],
    observedByYearStats: [{ ${chartFootprints[chartTypes.LINE_METADATA]} }],
    ageByGender: [{ ${chartFootprints[chartTypes.BOXPLOT]} }],
    observationLengthByGender: [{ ${chartFootprints[chartTypes.BOXPLOT]} }],
    observationLengthByAge: [{ ${chartFootprints[chartTypes.BOXPLOT]} }],
    cumulativeDuration: [{ ${chartFootprints[chartTypes.LINE]} }],
    observedByMonth: [{ ${chartFootprints[chartTypes.LINE_DATA_BY_MONTH]} }],
    periodPerPerson: [{ ${chartFootprints[chartTypes.DONUT]} }]
  }`,
  [reports.PERSON]: `{
    yearOfBirthData: [{ ${chartFootprints[chartTypes.LINE_DATA]} }],
    yearOfBirthStats: [{ ${chartFootprints[chartTypes.LINE_METADATA]} }],
    gender: [{ ${chartFootprints[chartTypes.DONUT]} }],
    race: [{ ${chartFootprints[chartTypes.DONUT]} }],
    ethnicity: [{ ${chartFootprints[chartTypes.DONUT]} }]
  }`,
  [reports.DATA_DENSITY]: `{
    recordsPerPerson: [{ ${chartFootprints[chartTypes.LINE_DATA_W_LEGEND]} }],
    totalRecords: [{ ${chartFootprints[chartTypes.LINE_DATA_W_LEGEND]} }],
    conceptsPerPerson: [{ ${chartFootprints[chartTypes.BOXPLOT]} }]
  }`,
  [reports.PROCEDURES]: `{
    procedureTreemap: [{ ${chartFootprints[chartTypes.TREEMAP]} }]
  }`,
  [reports.VISITS]: `{
    visitTreemap: [{ ${chartFootprints[chartTypes.TREEMAP]} }]
  }`,
  [reports.CONDITIONS]: `{
    conditions: [{ ${chartFootprints[chartTypes.TREEMAP]} }]
  }`,

  // Cohort characterization-specific
  [reports.COHORTPECIFIC]: `{
    personsByDurationFromStartToEnd: [{
      COHORT_DEFINITION_ID: Number,
      DURATION: Number,
      COUNT_VALUE: Number,
      PCT_PERSONS: Float | Number
    }],
    prevalenceByMonth: [{
      X_CALENDAR_MONTH: String,
      NUM_PERSONS: Number,
      Y_PREVALENCE_1000PP: Float | Number
    }],
    ageAtIndexDistribution: [{
      CATEGORY: String,
      COUNT_VALUE: Float | Number,
      MIN_VALUE: Float | Number,
      MAX_VALUE: Float | Number,
      AVG_VALUE: Float | Number,
      STDEV_VALUE: Float | Number,
      P10_VALUE: Float | Number,
      P25_VALUE: Float | Number,
      MEDIAN_VALUE: Float | Number,
      P75_VALUE: Float | Number,
      P90_VALUE: Float | Number,
      CONCEPT_ID: Number
    }],
    distributionOfAgeAtCohortStartByCohortStartYear: Array,
    distributionOfAgeAtCohortStartByGender: [{ ${chartFootprints[chartTypes.BOXPLOT]} }],
    personsInCohortFromCohortStartToEnd: [{ ${chartFootprints[chartTypes.LINE_DATA_BY_MONTH]} }],
    prevalenceByYearGenderSex: Array
  }`,
};

const chartSettings = {
  margin: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
};

const treemapReports = [
  reports.PROCEDURES,
  reports.DRUG,
  reports.DRUGERA,
  reports.OBSERVATIONS,
  reports.CONDITIONS,
  reports.CONDITIONERA,
  reports.VISITS,
];

export {
  reports,
  chartTypes,
  chartFootprints,
  reportFootprints,
  chartSettings,
  treemapReports,
};

export default {
  reports,
  chartTypes,
  chartFootprints,
  reportFootprints,
  chartSettings,
  treemapReports,
};
