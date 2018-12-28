/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface IAuthApiServices {
	users: any;
	auth_principal: any,
	auth_professionalTypes: any,
	auth_countries: any,
	auth_provinces: any,
	auth_logout: any,
	remind_password: any;
	reset_password: any;
}

export default <IAuthApiServices> reduxifyServices(
	API,
	{
		'users': 'auth_principal',
		'users/professional-types': 'auth_professionalTypes',
    'users/countries': 'auth_countries',
		'users/provinces': 'auth_provinces',
    'users/logout': 'auth_logout',
    'users/remind-password': 'remind_password',
    'users/reset-password': 'reset_password',
	}
);