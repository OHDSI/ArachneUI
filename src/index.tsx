// polyfills
import 'whatwg-fetch';
import 'es6-promise/auto';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import bootstrap from './bootstrap';

const rootEl = document.getElementById('root');
const app = bootstrap();
ReactDOM.render(app, rootEl);