import * as BEMHelper from 'react-bem-helper';
import { ConstructorOptions } from 'react-bem-helper';

function AppBEMHelper(params: string | ConstructorOptions, usePrefix: boolean = true) {
  let constructorOptions: ConstructorOptions = {
  	name: null,
  	prefix: usePrefix ? 'at-' : null,
  };

  if (typeof params === 'string') {
    constructorOptions.name = params;
  } else {
    constructorOptions = { ...params, ...constructorOptions };
  }

  return new BEMHelper(constructorOptions);
}

export default AppBEMHelper;
