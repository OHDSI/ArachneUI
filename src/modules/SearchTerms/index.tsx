import * as React from 'react';
import {
	Link,
} from 'arachne-components';
import {
  SidebarItem,
} from 'components';
import rootRoute from './routes';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'searchTerms',
  rootRoute: () => rootRoute('search-terms'),
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	navbarElement: () => [
		<SidebarItem name='Search' path={paths.termsList()} />,
	],
};

export default module;
