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
import { ModalUtils } from 'arachne-ui-components';
import { connect } from 'react-redux';
import { modal } from 'modules/Portal/const';
import actions from 'modules/Portal/actions';
import presenter from './presenter';

interface IStateProps {
  buildId: string,
  buildNumber: string,
  isLoading: boolean,
  projectVersion: string,
  vocabularyReleaseVersion: string,
}

interface IDispatchProps {
  hideModal: Function,
  loadBuildInfo: Function,
  loadVocabularyReleaseVersion: Function,
}

class AboutInfo extends Component<IStateProps & IDispatchProps & { modal: Object }, {}> {
  componentWillMount() {
    this.props.loadBuildInfo();
    this.props.loadVocabularyReleaseVersion();
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  return <IStateProps> {
    buildNumber: get(state, 'portal.buildInfo.queryResult.buildNumber'),
    buildId: get(state, 'portal.buildInfo.queryResult.buildId'),
    isLoading: get(state, 'portal.buildInfo.isLoading'),
    projectVersion: get(state, 'portal.buildInfo.queryResult.projectVersion'),
    vocabularyReleaseVersion: get<string>(state, 'portal.vocabularyReleaseVersion.queryResult.vocabularyVersion'),
  };
}

const mapDispatchToProps = {
  hideModal: () => ModalUtils.actions.toggle(modal.portalAboutInfo, false),
  loadBuildInfo: actions.buildInfo.load,
  loadVocabularyReleaseVersion: actions.vocabularyVersion.load,
};

const ModalAboutInfo = ModalUtils.connect({
  name: modal.portalAboutInfo,
})(AboutInfo);

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(ModalAboutInfo);
