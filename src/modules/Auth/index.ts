import * as React from 'react';
import rootRoute from './routes';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'auth',
  rootRoute: () => rootRoute('auth'),
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	sidebarElement: [
		{
			name: 'Login',
			path: '/auth/login' //paths.vocabsList(),
		},
	],
};

export default module;
