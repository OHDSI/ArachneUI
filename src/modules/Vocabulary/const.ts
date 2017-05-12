import keyMirror = require('keymirror');

const forms = keyMirror({
	download: null,
	toolbar: null,
  downloadSettings: null,
});

const modal = keyMirror({
  download: null,
  downloadResult: null,
});

const actionTypes = keyMirror({
  ALL_VOCABS_TOGGLED: null,
});

const paths = {
  vocabsList: () => '/vocabulary/list',
  history: () => '/vocabulary/download-history',
};

const apiPaths = {

};

const resultsPageSize = 15;

const cdmVersions = [
  {
    label: 'CDM VERSION',
    value: '',
  },
	{
    label: '4.5',
    value: '4.5',
  },
	{
    label: '5',
    value: '5',
  },
];

export {
  actionTypes,
  apiPaths,
  cdmVersions,
  forms,
  modal,
  paths,
  resultsPageSize,
};
