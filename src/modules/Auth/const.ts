import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  SET_AUTH_TOKEN: null,
  SET_BACK_URL: null,
});

const messages = keyMirror({
  REMIND_SUCCESS: null,
  RESET_SUCCESS: null,
});

const paths = {
	login: ({ message = '' } = {}) => `/auth/login${message ? `?message=${messages[message]}` : ''}`,
	register: () => '/auth/register',
  welcome: () => '/auth/welcome',
  remindPassword: () => '/auth/remind-password',
};

const forms = keyMirror({
  register: null,
  remind: null,
  reset: null,
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
  messages,
};
