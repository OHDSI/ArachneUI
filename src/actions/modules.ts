import { ReactElement } from 'react';
import actionTypes from 'const/actionTypes';
import { SideItem } from 'modules/IModule';
import { IAppAction } from './index';

interface IModuleMetadata {
  path: string;
  navbarElement: Array<ReactElement<any>>;
  sidebarElement: Array<SideItem>;
};

function register(module: IModuleMetadata): IAppAction<IModuleMetadata> {
  return {
    type: actionTypes.MODULE_REGISTER,
    payload: module,
  };
}

function setActive(activeModulePath: string): IAppAction<string> {
  return {
    type: actionTypes.MODULE_SET_ACTIVE,
    payload: activeModulePath,
  };
}

export default {
  register,
  setActive,
};

export {
  IModuleMetadata,
};
