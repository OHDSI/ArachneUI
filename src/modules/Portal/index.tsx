import * as React from 'react';
import {
	Link,
} from 'arachne-components';
import IModule from '../IModule';
import { paths } from './const';

const module: IModule = {
	namespace: 'portal',
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
	navbarElement: () => {
		const MenuAbout = require('./components/MenuAbout').default;
		return [
			<MenuAbout/>,
		]
	}
};

export default module;
