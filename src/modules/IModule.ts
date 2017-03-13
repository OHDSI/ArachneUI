import { ReactElement } from 'react';
import { PlainRoute } from 'react-router';
import { Reducer } from 'redux';
import { IAppActionCreatorTree } from 'actions';

type SideItem = {
	ico?: string;
  name: string;
  path?: string;
}

interface IModule {
  namespace: string; // Actions and reducers of module are put inside this namespace
  rootRoute: () => PlainRoute;
  actions: () => IAppActionCreatorTree,
  reducer: () => Reducer<any>;
  navbarElement?: Array<ReactElement<any>>;
  sidebarElement?: Array<SideItem>;
}

export default IModule;
export { SideItem };
