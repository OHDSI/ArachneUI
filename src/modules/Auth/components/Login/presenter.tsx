import * as React from 'react';
import {
  Button,
  Link,
  Panel
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';
import { get } from 'lodash';

require('./style.scss');

interface ILoginProps {
  goToSSO: Function;
  isSuccessfulReset: boolean;
}

function Login(props: ILoginProps) {
  const {
    goToSSO,
    isSuccessfulReset,
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
          {isSuccessfulReset &&
            <p {...classes('text', 'success')}>
              <p {...classes('text')}>
            This item requires authorization.<br/>
            Please login or register to access.
          </p>
            </p>
          }
          <Button
            {...classes('login')}
            onClick={goToSSO}
          >
            Click here to login
          </Button>
          <Button
            {...classes('register')}
            link={paths.register()}
          >
            Click here to register
          </Button>
          <Button
            {...classes('remind-password')}
            link={paths.remindPassword()}
          >
            Remind password
          </Button>
        </div>
      </Panel>
    </div>
  );
}

export default Login;
