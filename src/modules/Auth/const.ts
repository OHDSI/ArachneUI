import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  SET_AUTH_TOKEN: null,
  SET_BACK_URL: null,
});

const paths = {
	login: () => `/auth/login`,
	register: () => '/auth/register',
	welcome: () => '/auth/welcome',
};

const forms = keyMirror({
	register: null,
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
