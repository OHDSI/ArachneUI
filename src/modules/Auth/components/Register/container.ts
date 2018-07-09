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

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import professionalTypes from 'modules/Auth/actions/professionalTypes';
import presenter from './presenter';

interface IStateProps {
  isUserAuthed: boolean,
}

interface IDispatchProps {
  loadProfessionalTypes: Function,
  goToRoot: Function,
}

interface IRegisterProps extends IStateProps, IDispatchProps {}

class Register extends Component<IRegisterProps, {}> {
  componentWillMount() {
    if (this.props.isUserAuthed) {
      this.props.goToRoot();
    }
    this.props.loadProfessionalTypes();
  }
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IStateProps {
  return {
    isUserAuthed: !!state.auth.core.token,
  };
}

const mapDispatchToProps = {
  goToRoot: goToPage.bind(null, '/'),
  loadProfessionalTypes: professionalTypes.load,
};

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
 )
(Register);
