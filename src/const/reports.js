const reports = {
  DASHBOARD: 'dashboard',
  PERSON: 'person',
  OBSERVATION_PERIODS: 'observationperiods',
  DATA_DENSITY: 'datadensity',
  DEATH: 'death',
  CONDITIONS: 'conditions',
  CONDITIONERA: 'conditionera',
  OBSERVATIONS: 'observations',
  DRUGERA: 'drugeras',
  DRUG: 'drugexposures',
  PROCEDURES: 'procedures',
  VISITS: 'visits',
  ACHILLESHEEL: 'achillesheel',
  UNKNOWN: 'unknown',
  // Cohort characterization-specific
  COHORTPECIFIC: 'cohortspecific',
  HERACLESHEEL: 'heraclesheel',
  PROCEDURES_BY_INDEX: 'procbyindex',
  CONDITIONS_BY_INDEX: 'condbyindex',
  DATA_COMPLETENESS: 'datacompleteness',
  ENTROPY: 'entropy',
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
  TREEMAP_ERA: 'treemapera',
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
  reports.PROCEDURES_BY_INDEX,
  reports.CONDITIONS_BY_INDEX,
];

export {
  reports,
  chartTypes,
  chartSettings,
  treemapReports,
};

export default {
  reports,
  chartTypes,
  chartSettings,
  treemapReports,
};
