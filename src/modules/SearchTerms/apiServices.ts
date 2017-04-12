import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	terms: any,
	facets: any,
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'concepts': 'terms',
		'concepts/facets': 'facets',
	}
);