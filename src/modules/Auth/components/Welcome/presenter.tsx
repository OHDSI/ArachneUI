import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Link, Panel } from 'arachne-ui-components';
import { paths } from 'modules/Auth/const';

require('./style.scss');

function Welcome() {
  const classes = BEMHelper('welcome');
  const panelClasses = BEMHelper('welcome-panel');

  return (
    <div {...classes()}>
      <Panel
        {...panelClasses()}
        title="Welcome"
      >
        <div {...panelClasses('content')}>
          <p {...panelClasses('line')}>
            Thank you for registering with Athena.<br/>
            We have just sent you an email<br/>
            to confirm your account.
          </p>
          <p {...panelClasses('line')}>
            Please <Link to={paths.login()}>click here</Link> to return to login.
          </p>
        </div>
       </Panel>
    </div>
  );
}

export default Welcome;
