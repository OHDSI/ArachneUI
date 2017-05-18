import keyMirror = require('keymirror');

const resultsPageSize = 15;
const maxResultsPageSize = 30;

const forms = keyMirror({
  filter: null,
  toolbar: null,
});

const actionTypes = keyMirror({
  SEARCH_PAGE_SIZE_UPDATED: null,
  GRAPH_RENDER_STARTED: null,
  GRAPH_RENDER_FINISHED: null,
});

const paths = {
	termsList: () => '/search-terms/terms',
	term: (id: number, isTableMode: boolean = false) => `/search-terms/terms/${id}${isTableMode ? '/table' : ''}`,
};

const apiPaths = {
	downloadCsv: (query: string) => `/api/v1/concepts/download/csv${query}`,
};

const gapWidth = 100;
const rectHeight = 25;
const rectWidth = 250;
const conceptNameHeight = 40;
const maxNameLength = 30;
const conceptNameLeftPadding = 10;
const conceptNameTopPadding = 25;
const conceptBorderRadius = 7.5;
const conceptLeftPadding = 10;
const conceptTopPadding = 16;
const maxZoom = 3;
const minZoom = 0.25;


const controlSize = 40;
const controlsGapSize = 10;
const zoomStep = 0.25;

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
};
