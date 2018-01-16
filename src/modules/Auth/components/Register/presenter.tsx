import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel
} from 'arachne-ui-components';
import FormRegister from './FormRegister';

interface IRegisterProps {}

require('./style.scss');

function Register(props: IRegisterProps) {
  const classes = BEMHelper('register');

  return (
    <div {...classes()}>
      <Panel
         {...classes('form-panel')}
        title="New user registration"
      >
        <div {...classes('form-container')}>
          <FormRegister />
        </div>
      </Panel>
    </div>
  );
}

export default Register;
