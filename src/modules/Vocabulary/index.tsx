import * as React from 'react';
import {
  NavItem,
} from 'components';
import rootRoute from './routes';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'vocabulary',
  rootRoute: () => rootRoute('vocabulary'),
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	navbarElement: () => [
		<NavItem module='vocabulary' name='Download' path={paths.vocabsList()} />,
	],
};

export default module;
