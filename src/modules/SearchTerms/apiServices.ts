import reduxifyServices from 'feathers-reduxify-services';
import API from 'services/Api';

interface ISearchTermsServices {
	posts: any,
}

export default <ISearchTermsServices> reduxifyServices(
	API,
	{
		'posts': 'posts'
	}
);