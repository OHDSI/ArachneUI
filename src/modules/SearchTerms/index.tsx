import * as React from 'react';
import {
	Link,
} from 'arachne-components';
import rootRoute from './routes';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'searchTerms',
  rootRoute: () => rootRoute('search-terms'),
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	navbarElement: [
		<Link to={paths.termsList()}>Search Terms</Link>,
	],
	sidebarElement: [
	{
		name: 'Sidebar item 1'
	},
	{
		ico: 'report_problem',
		name: 'Sidebar item 2'
	},
	{
		name: 'Sidebar item 3',
		path: 'http://google.com'
	}],
};

export default module;
