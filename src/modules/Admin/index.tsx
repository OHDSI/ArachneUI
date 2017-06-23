import * as React from 'react';
import {
  NavItem,
} from 'components';
import rootRoute from './routes';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'admin',
  rootRoute: () => rootRoute('admin'),
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	isAdminOnly: true,
};

export default module;
