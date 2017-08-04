import { PlainRoute } from 'react-router';
import IModule from './IModule';
import Portal from './Portal';
import Auth from './Auth';
import SearchTerms from './SearchTerms';
import Vocabulary  from './Vocabulary';
import Admin  from './Admin';

const modules: IModule[] = [
  SearchTerms,
  Vocabulary,
	Auth,
	Portal,
	Admin,
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
