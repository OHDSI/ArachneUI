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

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { get } from 'services/Utils';
import { leaveIfAuthed } from 'modules/Auth/utils';
import presenter from './presenter';

class ResetPassword extends Component {
  componentWillMount() {
    leaveIfAuthed(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      leaveIfAuthed(nextProps);
    }
  }

  render() {
    return presenter(this.props);
  }
}

ResetPassword.propTypes = {
  goToRoot: PropTypes.func.isRequired,
  isUserAuthed: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isUserAuthed: !!get(state, 'auth.principal.queryResult.result.id'),
  };
}

const mapDispatchToProps = {
  goToRoot: () => goToPage('/'),
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
