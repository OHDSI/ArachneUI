import { PlainRoute } from 'react-router';
import { Reducer } from 'redux';
import { IAppActionCreatorTree } from 'actions';

interface IModule {
  namespace: string; // Actions and reducers of module are put inside this namespace
  rootRoute: () => PlainRoute;
  actions: () => IAppActionCreatorTree,
  reducer: () => Reducer<any>;
  navbarElement?: {
    ico: string;
    name: string;
  };
}

export default IModule;