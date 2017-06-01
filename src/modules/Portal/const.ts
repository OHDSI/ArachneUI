import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  RECEIVE_PORTAL_BUILD_INFO: null,
});

const modal = keyMirror({
  portalAboutInfo: null,
});

const paths = {
  odysseus: () => 'http://odysseusinc.com/',
};

const images = {
  logo: '/icons/logo/logo_odys.svg',
};

export {
  actionTypes,
  images,
  modal,
  paths,
};
