import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	terms: any,
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'concepts': 'terms',
	}
);