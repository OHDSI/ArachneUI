/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: April 26, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import actions from 'actions';
import { form } from 'modules/Portal/const';
import { validators } from 'services/Utils';
import FormPassword from './presenter';
import { Notifier } from 'services/Notifier';

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
  };
}

const mapDispatchToProps = {
  changePassword: (params, data) =>
    actions.portal.settings.changePassword(params, data),
  resetForm: () => resetForm(form.changePassword),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = dispatchProps.changePassword({}, {
        oldPassword: data.oldPassword,
        newPassword: data.password,
      });

      submitPromise
          .then(() => {
            dispatchProps.resetForm();
            Notifier.alert({message: 'Password has been updated successfully.'});
          })
          .catch(() => {
          });

      return submitPromise;
    },
  });
}

const ReduxForm = reduxForm({
  form: form.changePassword,
  validate: validators.checkPassword,
})(FormPassword);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxForm);
