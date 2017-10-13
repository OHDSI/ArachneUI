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

import URI from 'urijs';
import { actionTypes, apiPaths, paths } from 'modules/Auth/const';
import api from 'services/Api';
import { push as goToPage } from 'react-router-redux';
import errors from 'const/errors';
import { validators } from 'services/Utils';
import AuthService from 'services/Auth';
import { SubmissionError } from 'redux-form';
import { isAuthModulePath } from 'modules/Auth/utils';
import actions from 'actions';
import principal from './principal';

function setToken(token) {
  return {
    type: actionTypes.SET_AUTH_TOKEN,
    token,
  };
}

function requestResendEmail() {
  return {
    type: actionTypes.AUTH_REQUEST_EMAIL,
  };
}

function receiveResendEmail() {
  return {
    type: actionTypes.AUTH_RECEIVE_EMAIL,
  };
}

function receiveAuthMehtod(method) {
  return {
    type: actionTypes.AUTH_RECEIVE_METHOD,
    payload: method,
  };
}

// public

function register(args) {
  const regData = {
    firstname: args.firstname,
    middlename: args.middlename,
    lastname: args.lastname,
    email: args.email,
    password: args.password,
    professionalTypeId: args.professionalTypeId,
  };

  return () => api.doPost(
    apiPaths.register(),
    regData,
    (res) => {
      // If invalid credentials - show form error
      if (res.errorCode === errors.VALIDATION_ERROR) {
        throw new SubmissionError({
          _error: res.errorMessage,
          ...res.validatorErrors,
        });
      }
    }
  );
}

function login({ username, password, redirectTo }) {
  return dispatch => api.doPost(
    apiPaths.login(),
    { username, password },
    (res) => {
      // If invalid credentials - show form error
      if (res.errorCode === errors.UNAUTHORIZED) {
        throw new SubmissionError({
          _error: res.errorMessage,
        });
      } else if (res.errorCode === errors.UNACTIVATED) {
        throw new SubmissionError({
          _error: 'Please verify your account using link in the email that was sent to you.',
          unactivated: true,
        });
      }
      // Persist login token
      const token = res.result.token;
      AuthService.setToken(token);
      // prevent from returning to logout page
      const backUrl = (/\/auth\/logout/i).test(redirectTo) ? '/' : redirectTo;
      dispatch(goToPage(backUrl || '/'));
      // Load principal
      dispatch(principal.load());
    }
  );
}


function logout(backurl = '/') {
  return dispatch => api.doPost(
    apiPaths.logout(),
    {},
    () => {
      AuthService.clearToken();
      dispatch(principal.clear());
      if (actions.studyManager) {
        actions.studyManager.studyList.dropFilter();
      }
      // Redirect to auth screen if not already there
      const uri = new URI(backurl);
      if (!isAuthModulePath(uri.pathname())) {
        dispatch(goToPage(paths.login()));
      }
    }
  );
}

function remindPassword({ email }) {
  return () => api.doPost(
    apiPaths.remindPassword(),
    { email },
    (res) => {
      validators.checkValidationError(res);
    }
  );
}

function resetPassword({ email, token, password, callbackUrl }) {
  return () => api.doPost(
    apiPaths.resetPassword(),
    { email, token, password, callbackUrl },
    (res) => {
      validators.checkValidationError(res);
    }
  );
}

function resendEmail({ email }) {
  return (dispatch) => {
    dispatch(requestResendEmail());
    return api.doPost(
      apiPaths.resendEmail(),
      { email },
      (res) => {
        dispatch(receiveResendEmail());
        validators.checkValidationError(res);
      }
    );
  };
}

function getAuthMethod() {
  return dispatch => api.doGet(
    apiPaths.authMethod(),
    res => dispatch(receiveAuthMehtod(res.result.userOrigin))
  );
}

export default {
  register,
  login,
  logout,
  remindPassword,
  resetPassword,
  setToken,
  resendEmail,
  getAuthMethod,
};
