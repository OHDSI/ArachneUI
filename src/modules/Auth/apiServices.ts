import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface IAuthApiServices {
	auth_principal: any;
}

export default <IAuthApiServices> reduxifyServices(
	API,
	{
		'users/me': 'auth_principal',
	}
);