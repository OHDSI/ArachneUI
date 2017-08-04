import { Action } from 'redux';
import modules from './modules';

interface IAppAction<T> extends Action {
  type: string;
	payload: T;
}

type IAppActionCreator = Function;

interface IAppActionCreatorTree {
	[key: string]: IAppActionCreator | IAppActionCreatorTree;
};

const rootActions: IAppActionCreatorTree = {
  modules,
};

function injectAction(namespace: string, actions: IAppActionCreatorTree) {
  if (rootActions[namespace]) {
    console.error(`Such action namespace was already registered: ${namespace}`);
  }

  rootActions[namespace] = actions;
}

export default rootActions;
export {
	IAppAction,
	IAppActionCreatorTree,
  injectAction,
};