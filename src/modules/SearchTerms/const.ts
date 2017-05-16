import keyMirror = require('keymirror');

const resultsPageSize = 15;
const maxResultsPageSize = 30;

const forms = keyMirror({
  filter: null,
  toolbar: null,
});

const actionTypes = keyMirror({
  SEARCH_PAGE_SIZE_UPDATED: null,
});

const paths = {
	termsList: () => '/search-terms/terms',
	term: (id: number, isTableMode: boolean = false) => `/search-terms/terms/${id}${isTableMode ? '/table' : ''}`,
};

const apiPaths = {
	downloadCsv: (query: string) => `/api/v1/concepts/download/csv${query}`,
};

export {
  actionTypes,
  apiPaths,
  forms,
  maxResultsPageSize,
  paths,
  resultsPageSize,
};
