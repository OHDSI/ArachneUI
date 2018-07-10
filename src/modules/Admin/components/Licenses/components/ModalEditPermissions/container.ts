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
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import actions from 'modules/Admin/actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal, forms } from 'modules/Admin/const';
import { get, difference } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';
import { VocabularyOption, User, Vocabulary } from 'modules/Admin/components/Licenses/types';

interface IModalStateProps {
  vocabularies: Array<VocabularyOption>;
  initialValues: {
    vocabularies: Array<string>;
  };
  user: User;
  pendingVocabularies: Array<Vocabulary>;
};
interface IModalDispatchProps {
  close: () => (dispatch: Function) => any;
  remove: (id: string) => (dispatch: Function) => any;
  loadLicenses: () => (dispatch: Function) => any;
  resolveLicense: (id: number, allow: boolean) => (dispatch: Function) => any;
};
interface IModalProps extends IModalStateProps, IModalDispatchProps {
  doSubmit: (vocabs: Array<VocabularyOption>) => Promise<any>;
};

class ModalEditPermissions extends Component<IModalProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const vocabularies = selectors.getVocabularies(state);
  const pendingVocabularies = selectors.getPendingVocabularies(state);
  const user = get(state, 'modal.editPermission.data.user.name', {
    id: -1,
    name: 'Anonymous',
    email: '',
  });

	return {
    vocabularies,
    initialValues: {
      vocabularies: vocabularies.map(v => v.value.toString()),
    },
    user,
    pendingVocabularies,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.editPermission, false),
  remove: actions.licenses.remove,
  loadLicenses: actions.licenses.load,
  resolveLicense: actions.licenses.resolve,
};

function mergeProps(
  stateProps: IModalStateProps,
  dispatchProps: IModalDispatchProps,
  ownProps
  ) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    doSubmit: ({ vocabularies = [], pendingVocabs = [] }) => {
      const promises = [];
      difference(stateProps.initialValues.vocabularies, vocabularies).forEach((licenseId) => {
        promises.push(dispatchProps.remove(licenseId));
      });
      pendingVocabs.forEach((isAllowed: boolean, licenseId: number) => {
        promises.push(dispatchProps.resolveLicense(licenseId, isAllowed));
      });
      const promise = Promise.all(promises);
      promise
        .then(() => dispatchProps.close())
        .then(() => dispatchProps.loadLicenses())
        .catch(() => {});

      return promise;
    },
  };
}

let ReduxModalWindow = reduxForm({
  form: forms.editPermission,
  enableReinitialize: true,
})(ModalEditPermissions);
ReduxModalWindow = ModalUtils.connect({ name: modal.editPermission })(ReduxModalWindow);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
