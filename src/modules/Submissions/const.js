import keyMirror from 'keymirror';
import URI from 'urijs';

const forms = keyMirror({
  createSubmission: null,
});

const modal = keyMirror({
  createSubmission: null,
});

const paths = {
  submissions: () => '/submissions/list',
};

const apiPaths = {
  submissionList: ({ query }) => {
    const uri = new URI('/api/v1/admin/submissions');
    if (query) {
      uri.setSearch(query);
    }
    return uri.toString();
  },
  invalidateAnalyses: () => '/api/v1/admin/analysis/invalidate',
  submissions: () => '/api/v1/analysis',
  dataSourcesOptionList: () => '/api/v1/data-sources',
  analysisTypesOptionList: () => '/api/v1/analysis/types',
};

const links = {
  downloadResults: id => `/api/v1/analysis/${id}/results`,
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Bullet-List.png',
};

const extensionsForEntryPoints = ['R', 'r', 'sql', 'SQL', 'json', 'JSON'];

const pollTime = 10000;

const statusDictionary = {
  CREATED: {
    key: 'CREATED',
    label: 'CREATED',
    color: 'grey',
  },
  FILES_DOWNLOAD_FAILURE: {
    key: 'FILES_DOWNLOAD_FAILURE',
    label: 'FILES DOWNLOAD FAILURE',
    color: 'red',
  },
  EXECUTION_READY: {
    key: 'EXECUTION_READY',
    label: 'EXECUTION READY',
    color: 'blue',
  },
  EXECUTION_FAILURE: {
    key: 'EXECUTION_FAILURE',
    label: 'EXECUTION FAILURE',
    color: 'red',
  },
  EXECUTING: {
    key: 'EXECUTING',
    label: 'EXECUTING',
    color: 'blue',
  },
  EXECUTED: {
    key: 'EXECUTED',
    label: 'EXECUTED',
    color: 'purple',
  },
  SENDING_TO_CENTRAL_FAILURE: {
    key: 'SENDING_TO_CENTRAL_FAILURE',
    label: 'SENDING TO CENTRAL FAILURE',
    color: 'red',
  },
  CLOSED: {
    key: 'CLOSED',
    label: 'CLOSED',
    color: 'green',
  },
  DEAD: {
    key: 'DEAD',
    label: 'DEAD',
    color: 'red',
  },
};

const sections = {
  ARCHIVE: 'Files in archive',
  FILES: 'Separate files',
  STRATEGUS: 'Strategus JSON',
};

function getTypeByShortPrefix(prefix) {
  switch (prefix) {
    case 'ple': return 'ESTIMATION';
    case 'plp': return 'PREDICTION';
    case 'cc': return 'COHORT_CHARACTERIZATION';
    case 'cc_hrcls': return 'COHORT_HERACLES';
    case 'c': return 'COHORT';
    case 'ir': return 'INCIDENCE';
    case 'txp': return 'COHORT_PATHWAY';
    default: return '';
  }
}

export { forms, modal, paths, apiPaths, imgs, links, statusDictionary,
  extensionsForEntryPoints, pollTime, sections, getTypeByShortPrefix };
