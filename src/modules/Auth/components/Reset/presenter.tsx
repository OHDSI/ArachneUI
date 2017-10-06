import * as React from 'react';
import {
  Button,
  Panel,
  Form,
  LoadingPanel,
  FormInput,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';

require('./style.scss');

function Reset(props) {
  const classes = BEMHelper('reset');
  const {
    isLoading,
    doSubmit,
  } = props;
  const fields = [
    {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'new password',
          type: 'password',
          required: true,
        },
      },
    },
  ];
  const submitBtn = {
    label: 'Send request',
    loadingLabel: 'Sending...',
  };

  return (
    <div {...classes()}>
      <Panel
        {...classes('form-panel')}
        title="Reset password"
      >
        <div {...classes('form-container')}>          
          <Form
            fields={fields}
            submitBtn={submitBtn}
            onSubmit={doSubmit}
            {...props}
          />
          <Button {...classes('back-btn')} link={paths.login()}>Back to login</Button>
          <LoadingPanel active={isLoading} />
        </div>
      </Panel>
    </div>
  );
}

export default Reset;


