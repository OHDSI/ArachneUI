import { PlainRoute } from 'react-router';
import IModule from './IModule';
import SearchTerms from './SearchTerms';

const modules: IModule[] = [
  {
    namespace: 'searchTerms',
    rootRoute: () => SearchTerms.rootRoute('search-terms'),
    actions: SearchTerms.actions,
    reducer: SearchTerms.reducer,
  } as IModule,
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