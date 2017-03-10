import { PlainRoute } from 'react-router';
import IModule from './IModule';
import SearchTerms from './SearchTerms';

const modules: IModule[] = [
  SearchTerms,
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