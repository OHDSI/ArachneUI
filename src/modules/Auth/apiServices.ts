import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface IAuthApiServices {
	auth_principal: any,
	auth_professionalTypes: any,
	auth_logout: any,
}

export default <IAuthApiServices> reduxifyServices(
	API,
	{
		'users': 'auth_principal',
		'users/professional-types': 'auth_professionalTypes',
		'users/logout': 'auth_logout',
	}
);