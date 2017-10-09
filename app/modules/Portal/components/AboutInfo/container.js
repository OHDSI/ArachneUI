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
 * Created: February 20, 2017
 *
 */

import { Component, PropTypes } from 'react';
import get from 'lodash/get';
import { ModalUtils } from 'arachne-components';
import { connect } from 'react-redux';
import { modal } from 'modules/Portal/const';
import actions from 'actions';
import presenter from './presenter';

class AboutInfo extends Component {
  componentWillMount() {
    this.props.loadBuildInfo();
  }

  render() {
    return presenter(this.props);
  }
}

AboutInfo.propTypes = {
  loadBuildInfo: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    buildNumber: get(state, 'portal.buildInfo.data.buildNumber'),
    buildId: get(state, 'portal.buildInfo.data.buildId'),
    isLoading: get(state, 'portal.buildInfo.isLoading'),
    projectVersion: get(state, 'portal.buildInfo.data.projectVersion'),
  };
}

const mapDispatchToProps = {
  loadBuildInfo: () => actions.portal.buildInfo.find(),
  hideModal: () => ModalUtils.actions.toggle(modal.portalAboutInfo, false),
};

const ModalAboutInfo = ModalUtils.connect({
  name: modal.portalAboutInfo,
})(AboutInfo);

export default connect(mapStateToProps, mapDispatchToProps)(ModalAboutInfo);
