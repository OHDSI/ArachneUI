import keyMirror = require('keymirror');

const resultsPageSize = 15;
const maxResultsPageSize = 30;

const forms = keyMirror({
  filter: null,
  toolbar: null,
  termFilters: null,
});

const actionTypes = keyMirror({
  SEARCH_PAGE_SIZE_UPDATED: null,
  GRAPH_RENDER_STARTED: null,
  GRAPH_RENDER_FINISHED: null,
});

const paths = {
	termsList: () => '/search-terms/terms',
	term: (id: number, isGraphMode: boolean = false) => `/search-terms/terms/${id}${isGraphMode ? '/graph' : ''}`,
};

const apiPaths = {
	downloadCsv: (query: string) => `/api/v1/concepts/download/csv${query}`,
};

const gapWidth = 140;
const rectHeight = 25;
const rectWidth = 250;
const conceptNameHeight = 40;
const maxNameLength = 30;
const conceptNameLeftPadding = 10;
const conceptNameTopPadding = 25;
const conceptBorderRadius = 3;
const conceptLeftPadding = 10;
const conceptTopPadding = 16;
const maxZoom = 3;
const minZoom = 0.25;

const controlSize = 40;
const controlsGapSize = 10;
const zoomStep = 0.25;

const circleHeight = 120;
const circleWidth = 120;
const circleBorderRadius = 60;

const defaultLevels = 10;
const defaultStandardsOnly = false;
const facetKeys = keyMirror({
  domain: null,
  standardConcept: null,
  conceptClass: null,
  vocabulary: null,
  invalidReason: null,
});
const facetTitles = {
  [facetKeys.domain]: 'Domain',
  [facetKeys.standardConcept]: 'Standard concept',
  [facetKeys.conceptClass]: 'Class',
  [facetKeys.vocabulary]: 'Vocabulary',
  [facetKeys.invalidReason]: 'Invalid reason',
};
const zoomLevels = [
  {
    label: 'Minimum',
    value: 1,
  },
  {
    label: 'Vocabularies',
    value: 2,
  },
  {
    label: 'Concept Classes',
    value: 3,
  },
  {
    label: 'Maximum',
    value: 4,
  },
];
const defaultZoomLevel = 4;

export {
  actionTypes,
  apiPaths,
  forms,
  maxResultsPageSize,
  paths,
  resultsPageSize,
  gapWidth,
  rectHeight,
  rectWidth,
  conceptNameHeight,
  maxNameLength,
  conceptNameLeftPadding,
  conceptNameTopPadding,
  conceptBorderRadius,
  conceptLeftPadding,
  conceptTopPadding,
  maxZoom,
  minZoom,  
  controlSize,
  controlsGapSize,
  zoomStep,
  defaultLevels,
  defaultStandardsOnly,
  facetKeys,
  facetTitles,
  zoomLevels,
  defaultZoomLevel,
  circleHeight,
  circleWidth,
  circleBorderRadius,
};
