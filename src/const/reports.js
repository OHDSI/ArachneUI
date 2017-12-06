import keyMirror from 'keymirror';

const reports = keyMirror({
  dashboard: null,
  person: null,
  observationperiods: null,
  datadensity: null,
  death: null,
  conditions: null,
  conditionera: null,
  observations: null,
  drugeras: null,
  drugexposures: null,
  procedures: null,
  visits: null,
  achillesheel: null,
  unknown: null,
  // Cohort characterization-specific
  cohortspecific: null,
  heraclesheel: null,
  procbyindex: null,
  condbyindex: null,
  drugbyindex: null,
  datacompleteness: null,
  entropy: null,
});

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
  reports.procedures,
  reports.drugexposures,
  reports.drugeras,
  reports.observations,
  reports.conditions,
  reports.conditionera,
  reports.visits,
  reports.procbyindex,
  reports.condbyindex,
  reports.drugbyindex,
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
