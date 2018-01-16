import * as React from 'react';
import {
  Button,
  Panel,
  Form,
  LoadingPanel,
  FormInput,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';

require('./style.scss');

function Remind(props) {
  const classes = BEMHelper('remind');
  const {
    isLoading,
    doSubmit,
  } = props;
  const fields = [
    {
      name: 'email',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Email',
          type: 'text',
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
        title="Remind password"
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

export default Remind;


