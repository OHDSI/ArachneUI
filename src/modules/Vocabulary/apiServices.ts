import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	vocabularies: any;
	download: any;
	history: any;
	vocabLicenses: any;
	restore: any;
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'vocabularies': 'vocabularies',
		'vocabularies/save': 'download',
		'vocabularies/downloads': 'history',
		'vocabularies/licenses/request': 'vocabLicenses',
		'vocabularies/restore': 'restore',
	}
);