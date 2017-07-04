import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface IAdminServices {
	vocabularies: any;
	licenses: any;
	users: any;
	licenseAccept: any;
}

export default <IAdminServices> reduxifyServices(
	API,
	{
		'vocabularies/licenses/suggest': 'vocabularies',
		'vocabularies/licenses': 'licenses',
		'users/suggest': 'users',
		'vocabularies/licenses/accept': 'licenseAccept',
	}
);