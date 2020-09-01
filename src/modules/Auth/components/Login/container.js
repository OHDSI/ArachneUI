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
 * Created: December 14, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import actions from 'actions';
import { asyncConnect } from 'redux-async-connect';
import { get } from 'services/Utils';
import { leaveIfAuthed } from 'modules/Auth/utils';
import { nodeFunctionalModes } from 'modules/Auth/const';
import presenter from './presenter';

class Login extends Component {
  componentWillMount() {
    leaveIfAuthed(this.props);
  }

  componentDidMount() {
    if (__APP_TYPE_CENTRAL__) {
      this.props.authMethod();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      leaveIfAuthed(nextProps);
    }
    if (__APP_TYPE_NODE__ && this.props.runningMode !== nextProps.runningMode 
        && nextProps.runningMode === nodeFunctionalModes.Network) {
      this.props.authMethod();
    }
  }

  render() {
    return presenter(this.props);
  }
}

Login.propTypes = {
  goToRoot: PropTypes.func.isRequired,
  isUserAuthed: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const runningMode = get(state, 'auth.nodeMode.data.mode');
  return {
    message: state.routing.locationBeforeTransitions.query.message,
    isUserAuthed: !!get(state, 'auth.principal.queryResult.result.id'),
    runningMode,
  };
}

const mapDispatchToProps = {
  goToRoot: goToPage.bind(null, '/'),
  authMethod: actions.auth.authMethod.findUnsecured,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
