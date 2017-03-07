import keyMirror = require('keymirror');

const resultsPageSize = 12;

const forms = keyMirror({
  filter: null,
});

const actionTypes = keyMirror({
  SEARCH_PAGE_SIZE_UPDATED: null,
});

const paths = {
	termsList: () => '/search-terms/terms',
};

export {
  actionTypes,
  forms,
  paths,
  resultsPageSize,
};
