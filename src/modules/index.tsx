import { PlainRoute } from 'react-router';
import IModule from './IModule';
import Auth from './Auth';
import SearchTerms from './SearchTerms';
import Vocabulary  from './Vocabulary';

const modules: IModule[] = [
  SearchTerms,
  Vocabulary,
	Auth,
];

const indexRoute: PlainRoute = {
	onEnter: (nextState, replace) => {
		replace('/search-terms');
	},
};

export {
	indexRoute,
	modules,
};