import * as React from 'react';
import {
  Button
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';
import { get } from 'lodash';

// require('./style.scss');

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
      <Button onClick={goToSSO}>
        Login via SSO
      </Button>
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
