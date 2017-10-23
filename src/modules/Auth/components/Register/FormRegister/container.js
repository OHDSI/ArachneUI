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
 * Created: December 14, 2016
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import actions from 'actions/index';
import { paths } from 'modules/Auth/const';
import { validators } from 'services/Utils';
import FormRegister from './presenter';
import get from "lodash/get";

function mapStateToProps(state) {
  const professionalTypesList = get(state, 'auth.professionalTypes.queryResult.result', []);

  return {
    isLoading: state.auth.professionalTypes.isLoading,
    professionalTypesOptions: professionalTypesList.map(type => ({
      label: type.name,
      value: type.id,
    })),
  };
}

const mapDispatchToProps = {
  register: actions.auth.register,
  goToWelcome: () => goToPage(paths.welcome()),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = dispatchProps.register({}, data);
      submitPromise
        .then(() => dispatchProps.goToWelcome())
        .catch(() => {});
      return submitPromise;
    },
  });
}

const ReduxFormRegister = reduxForm({
  form: 'register',
  validate: validators.checkPassword,
})(FormRegister);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormRegister);
