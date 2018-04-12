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

interface IResetStateProps {
  isUserAuthed: boolean;
  email: String;
  token: string;
}

interface IResetDispatchProps {
  goToLogin: Function;
}

interface IResetProps extends IResetStateProps, IResetDispatchProps {
  doSubmit: Function;
};

class Reset extends Component<IResetProps, {}> {
  componentWillMount() {
    if (this.props.isUserAuthed) {
      this.props.goToLogin();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      if (nextProps.isUserAuthed) {
        this.props.goToLogin();
      }
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const email = get(state, 'routing.locationBeforeTransitions.query.email', '');
  const token = get(state, 'routing.locationBeforeTransitions.query.token', '');

  return {
    isUserAuthed: !!get(state, 'auth.principal.data.id'),
    email,
    token,
  };
}

const mapDispatchToProps = {
  goToLogin: () => push(paths.login({ message: messages.RESET_SUCCESS })),
};

function mergeProps(
  stateProps: IResetStateProps,
  dispatchProps: IResetDispatchProps,
  ownProps: {}
): IResetProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ password }) {
      const promise = login.resetPassword({
        password,
        email: stateProps.email,
        token: stateProps.token,
      });
      promise.payload.promise
        .then(() => dispatchProps.goToLogin())
        .catch(() => {});

      return promise.payload.promise;
    },
  };
}

const FormReset = reduxForm({
  form: forms.reset,
})(Reset);

export default connect<IResetStateProps, IResetDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(FormReset);
