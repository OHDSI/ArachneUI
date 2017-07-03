import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import actions from 'modules/Admin/actions';
import { ModalUtils } from 'arachne-components';
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
    doSubmit: ({ vocabularies, pendingVocabs }) => {
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
