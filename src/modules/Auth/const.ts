import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  SET_AUTH_TOKEN: null,
  SET_BACK_URL: null,
});

const paths = {
	login: ({ successfulReset = false } = {}) => `/auth/login${successfulReset ? '?successful_reset' : ''}`,
	register: () => '/auth/register',
  welcome: () => '/auth/welcome',
  remindPassword: () => '/auth/remind-password',
};

const forms = keyMirror({
  register: null,
  remind: null,
});

const apiPaths = {
  myUserpic: hash => `/api/v1/user-management/users/avatar/${hash ? `?${hash}` : ''}`,
};

const roles = keyMirror({
  ROLE_USER: null,
  ROLE_ADMIN: null,
});

export {
  actionTypes,
  apiPaths,
  forms,
  paths,
  roles,
};
