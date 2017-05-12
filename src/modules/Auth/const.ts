import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  SET_AUTH_TOKEN: null,
  SET_BACK_URL: null,
});

const paths = {
	login: () => `/auth/login`,
};

const apiPaths = {
  myUserpic: hash => `/api/v1/user-management/users/avatar/${hash ? `?${hash}` : ''}`,
};

export {
  actionTypes,
  apiPaths,
  paths,
};
