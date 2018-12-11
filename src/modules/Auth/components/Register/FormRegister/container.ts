/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import { get } from 'lodash';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import { register as doRegister } from 'modules/Auth/actions/principal';
import { forms, paths } from 'modules/Auth/const';
import presenter from './presenter';
import selectors from './selectors';

interface IStateProps {
  isLoading: boolean,
  professionalTypes: Object[],
}

interface IDispatchProps {
  doRegister: Function,
  goToWelcome: Function,
}

interface IRegisterProps extends IStateProps, IDispatchProps {}

class FormRegister extends Component<IRegisterProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IStateProps {
  return {
    isLoading: get(state, 'auth.professionalTypes.isLoading', false),
    professionalTypes: selectors.getProfessionalTypes(state),
  };
}

const mapDispatchToProps = function(dispatch): IDispatchProps {
  return {
    doRegister: (data) => dispatch(doRegister(data)),
    goToWelcome: () => dispatch(goToPage(paths.welcome())),
  }
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit: function(data) {
      const reg = {
        ...data,
        address: {
          ...data.address,
          country: (data.address && data.address.country) ? ownProps.countries.filter(c => c.value === data.address.country)
            .map(c => ({isoCode: c.value,})).shift() : null,
          stateProvince: (data.address && data.address.stateProvince) ? ownProps.provinces.filter(p => p.value === data.address.stateProvince)
            .map(p => ({isoCode: p.value,})).shift() : null,
        }
      };
      const submitPromise = dispatchProps.doRegister(reg);

      submitPromise
        .then(() => dispatchProps.goToWelcome())
        .catch(() => {});

      return submitPromise;
    },
  };
}

const ReduxFormRegister = reduxForm({
  form: forms.register,
})(FormRegister);

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )
(ReduxFormRegister);
