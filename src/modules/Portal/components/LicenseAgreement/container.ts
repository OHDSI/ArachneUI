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
 * Created: October 3, 2018
 *
 */

import { Component } from 'react';
import { ModalUtils } from 'arachne-ui-components';
import { connect } from 'react-redux';
import { modal } from 'modules/Portal/const';
import * as get from 'lodash/get';
import presenter from './presenter';
import actions from '../../actions';

interface IStateProps {
  isLoggedIn: boolean;
  isAccepted: boolean;
  isModalOpened: boolean;
}

interface IDispatchProps {
  showModal: Function;
  getIsAccepted: Function;
  setIsAccepted: Function;
}

interface ILicenseAgreementProps extends IStateProps, IDispatchProps {
  accept: Function;
}

type IMergeProps = (s: IStateProps, d: IDispatchProps, o: any) => ILicenseAgreementProps;

class LicenseAgreement extends Component<ILicenseAgreementProps & { modal: Object }, {}> {
  componentWillMount() {
    this.props.getIsAccepted();
  }

  componentWillReceiveProps(nextProps: ILicenseAgreementProps) {
    if (!nextProps.isAccepted && !nextProps.isModalOpened) {
      this.props.showModal();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  return <IStateProps> {
    isLoggedIn: !!get(state, 'auth.core.token', ''),
    isAccepted: !!get(state, 'portal.licenseAgreement.isAccepted', false),
    isModalOpened: get(state, 'modal.'+modal.portalLicenseAgreement+'.isOpened', false),
  };
}

const mapDispatchToProps = {
  hideModal: () => ModalUtils.actions.toggle(modal.portalLicenseAgreement, false),
  showModal: () => ModalUtils.actions.toggle(modal.portalLicenseAgreement, true),
  getIsAccepted: () => actions.licenseAgreement.getIsAccepted(),
  setIsAccepted: (value: boolean) => actions.licenseAgreement.setIsAccepted(value),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    accept() {
      dispatchProps.setIsAccepted(true);
      dispatchProps.hideModal();
    },
  };
}

const ModalLicenseAgreement = ModalUtils.connect({
  name: modal.portalLicenseAgreement,
})(LicenseAgreement);

export default connect<IStateProps, IDispatchProps, IMergeProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ModalLicenseAgreement);
