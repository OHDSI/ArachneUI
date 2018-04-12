// polyfills
import './styles/appContainer.scss';
import 'whatwg-fetch';
import 'es6-promise/auto';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';
import 'core-js/fn/array/find';

import * as ReactDOM from 'react-dom';
import bootstrap from './bootstrap';
import { StartAnalytics } from 'services/Gtagger';

if (!Array.prototype.includes) {
	Array.prototype.includes = function(value){
		return this.indexOf(value) > -1;
	}
}

const rootEl = document.getElementById('app');
bootstrap().then(app => {
	ReactDOM.render(app, rootEl);
	StartAnalytics();
});