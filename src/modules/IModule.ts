import { ReactElement } from 'react';
import { PlainRoute } from 'react-router';
import { Reducer } from 'redux';
import { IAppActionCreatorTree } from 'actions';

type NavItem = {
	children?: any;
  name?: string;
  path?: string;
  onClick?: any;
  module?: string;
  isActive?: boolean;
}

interface IModule {
  namespace: string; // Actions and reducers of module are put inside this namespace
  rootRoute?: () => PlainRoute;
  actions: () => IAppActionCreatorTree,
  reducer: () => Reducer<any>;
  navbarElement?: () => Array<ReactElement<any>>;
}

export default IModule;
export { NavItem };
