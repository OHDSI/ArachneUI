import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	terms: any,
	relations: any,
	relationships: any,
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'concepts': 'terms',
		'concepts/:id/relations': 'relations',
		'concepts/:id/relationships': 'relationships',
	}
);