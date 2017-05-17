import * as React from 'react';
import {
  Button,
  Panel
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';
import { get } from 'lodash';

require('./style.scss');

interface ILoginStateProps {
  backUrl: string;
}

interface ILoginDispatchProps {
  goToSSO: Function;
}

interface ILoginOwnProps {
}

interface ILoginProps extends ILoginStateProps, ILoginDispatchProps {};

function Login(props: ILoginProps) {
  const {
    goToSSO,
  } = props;
  const classes = BEMHelper('login');

  return (
    <div {...classes()}>
      <Panel title='Login or register to access'>
        <div {...classes('modal-content')}>
          <p {...classes('text')}>
            This item requires authorization.<br/>
            Please login or register to access.
          </p>
          <Button
            {...classes('login')}
            onClick={goToSSO}
          >
            Click here to login
          </Button>
          {/* <Button
            {...classes('register')}
          >
            Click here to register
          </Button> */}
        </div>
      </Panel>
    </div>
  );
}

export default Login;
export {
  ILoginProps,
  ILoginStateProps,
  ILoginDispatchProps,
  ILoginOwnProps,
};
