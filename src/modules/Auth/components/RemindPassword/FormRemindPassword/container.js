/*
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
 * Created: December 30, 2016
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import actions from 'actions/index';
import { form, loginMessages, paths } from 'modules/Auth/const';
import RemindPassword from './presenter';

function mapStateToProps() {
  return {
    loginPath: paths.login(),
  };
}

const mapDispatchToProps = {
  remindPassword: actions.auth.remindPassword.create,
  goToPage: push,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit: ({ email }) => {
      const data = { email };
      const submitPromise = dispatchProps.remindPassword({}, data);

      submitPromise.then(() => {
        const loginUrl = paths.login(loginMessages.remindDone);
        dispatchProps.goToPage(loginUrl);
      });

      return submitPromise;
    },
  });
}

const ReduxFormRemindPassword = reduxForm({
  form: form.remindPassword,
})(RemindPassword);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormRemindPassword);
