import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	vocabularies: any;
	download: any;
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'vocabularies': 'vocabularies',
		'vocabularies/save': 'download',
	}
);