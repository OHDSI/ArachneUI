import keyMirror = require('keymirror');

const forms = keyMirror({
	addPermission: null,
	editPermission: null,
});

const modal = keyMirror({
	addPermission: null,
	editPermission: null,
});

const actionTypes = keyMirror({
});

const paths = {
	licenses: () => '/admin/licenses',
};

const apiPaths = {
};

export {
  actionTypes,
  apiPaths,
  forms,
  modal,
  paths,
};
