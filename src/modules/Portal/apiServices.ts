import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface IPortalServices {
	buildInfo: any,
}

export default <IPortalServices> reduxifyServices(
	API,
	{
		'build-number': 'buildInfo',
	}
);