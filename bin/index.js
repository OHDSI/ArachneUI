/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: July 13, 2017
 *
 */

// require('../server.babel'); // babel registration (runtime transpilation for node)
/**
 * Define isomorphic constants.
 */
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

//!!polyfills:
require('localstorage-polyfill');

global.window = {};
global.document = {};
global.navigator = {};
global.crypto = {};

global.__APP_TYPE_CENTRAL__ = process.env.APP_TYPE === 'central';
global.__APP_TYPE_NODE__ = process.env.APP_TYPE === 'node';

const server = require('./server.js');
server.setup();
