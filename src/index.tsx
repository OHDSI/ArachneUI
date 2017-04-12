// polyfills
import 'whatwg-fetch';
import 'es6-promise/auto';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';

import * as ReactDOM from 'react-dom';
import bootstrap from './bootstrap';

const rootEl = document.getElementById('app');
bootstrap().then(app => {
	ReactDOM.render(app, rootEl);
});