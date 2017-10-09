/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 14, 2016
 *
 */

import React from 'react';
import {
  Link,
  Form,
  Fieldset,
  FormInput,
  Button,
  LoadingPanel,
} from 'arachne-components';
import { Field } from 'redux-form';
import { paths, authMethods } from 'modules/Auth/const';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function RemindPasswordLink({ className, link }) {
  const classes = new BEMHelper('form-login-remind-password');

  return (
    <div {...classes({ extra: className })}>
      <Link {...classes('link')} to={link}>
        Forgot password?
      </Link>
    </div>
  )
}

function FormLogin(props) {
  const {
    doSubmit,
    remindPasswordLink,
    // redux-form
    error,
    handleSubmit,
    submitting,
    isUnactivated,
    resendEmail,
    isLoading,
    authMethod,
  } = props;

  const fields = {
    username: {
      name: 'username',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Email address',
          type: 'text',
        }
      },
    },
    password: {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Password',
          type: 'password',
        }
      },
    },
    redirectTo: {
      name: 'redirectTo',
      InputComponent: {
        component: FormInput,
        props: {
          type: 'hidden',
        }
      },
    }
  };

  const classes = new BEMHelper('form-login-container');
  const formClasses = new BEMHelper('form-login');
  
  return (
    <div {...classes()}>
      <form onSubmit={handleSubmit(doSubmit)} {...formClasses()}>
        <Field
          {...formClasses('group')}
          component={Fieldset}
          {...fields.username}
        />
        <Field
          {...formClasses('group')}
          component={Fieldset}
          {...fields.password}
        />
        <Field
          {...formClasses('group', 'hidden')}
          component={Fieldset}
          {...fields.redirectTo}
        />
        {authMethod !== authMethods.LDAP &&
          <RemindPasswordLink
            {...formClasses('group')}
            link={remindPasswordLink}
          />
        }
        {error && 
          <span {...formClasses('error')}>{error}</span>
        }
        {isUnactivated && authMethod !== authMethods.LDAP &&
          <Button
            {...classes('resend-button')}
            onClick={resendEmail}
          >
            Resend activation email
          </Button>
        }
        <div {...formClasses('actions')}>
          <Button
            {...formClasses('submit')}
            type="submit"
            label={submitting ? 'Logging in...' : 'Login'}
            mods={['submit', 'rounded']}
            disabled={submitting}
          />
        </div>
      </form>

      {authMethod !== authMethods.LDAP &&
        <span {...classes('register-caption')}>
          Don't have an account? <Link to={paths.register()}>Register here</Link>
        </span>
      }
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default FormLogin;