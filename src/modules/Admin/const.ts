import keyMirror = require('keymirror');

const forms = keyMirror({
	addPermission: null,
	editPermission: null,
	licenseFilter: null,
});

const modal = keyMirror({
	addPermission: null,
	editPermission: null,
});

const actionTypes = keyMirror({
});

const paths = {
	licenses: (pendingOnly: boolean) => `/admin/licenses${pendingOnly ? '/pending' : ''}`,
};

const apiPaths = {
};

const pageSize = 12;

export {
  actionTypes,
  apiPaths,
  forms,
  modal,
  paths,
  pageSize,
};
