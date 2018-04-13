/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { get } from 'lodash';
import login from 'modules/Auth/actions/login';
import { forms, paths, messages } from 'modules/Auth/const';
import presenter from './presenter';

interface IRemindStateProps {
}

interface IRemindDispatchProps {
  goToLogin: Function;
}

interface IRemindProps extends IRemindStateProps, IRemindDispatchProps {
  doSubmit: Function;
};

class Remind extends Component<IRemindProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  goToLogin: () => push(paths.login({ message: messages.REMIND_SUCCESS })),
};

function mergeProps(
  stateProps: IRemindStateProps,
  dispatchProps: IRemindDispatchProps,
  ownProps: {}
): IRemindProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ email }) {
      const promise = login.remindPassword(email);
      promise.payload.promise
        .then(() => dispatchProps.goToLogin())
        .catch(() => {});

      return promise.payload.promise;
    },
  };
}

const FormRemind = reduxForm({
  form: forms.remind,
})(Remind);

export default connect<IRemindStateProps, IRemindDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(FormRemind);
