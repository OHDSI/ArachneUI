import { Component } from 'react';
import { connect } from 'react-redux';
import actions from 'modules/Vocabulary/actions';
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/Vocabulary/const';
import { licenseStatuses } from 'const/vocabulary';
import { get } from 'lodash';
import presenter from './presenter';
import {
  Vocabulary,
} from '../Results/selectors';

interface IModalStateProps {
  vocab: Vocabulary;
  isLoading: boolean;
};

interface IModalDispatchProps {
  close: () => null;
  requestLicense: (id: number) => Promise<any>;
  openConfirmModal: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
  modal: string;
  request: Function;
};

class ModalRequestLicense extends Component<IModalProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const vocab: Vocabulary = get(state, 'modal.requestLicense.data', {
    id: -1,
    code: '',
    name: 'Unnamed vocabulary',
    available: true,
    update: '',
    index: 0,
    isCheckable: false,
    isChecked: false,
    tableRowClass: '',
    status: licenseStatuses.APPROVED,
    clickDefault: false,
  });
  const isLoading = get(state, 'vocabulary.vocabLicenses.isSaving', false);

	return {
    vocab,
    isLoading,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.requestLicense, false),
  requestLicense: actions.vocabularies.requestLicense,
  openConfirmModal: () => ModalUtils.actions.toggle(modal.confirmLicense, true),
};

function mergeProps(
  stateProps: IModalStateProps,
  dispatchProps: IModalDispatchProps,
  ownProps
  ): IModalProps {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    request: () => {
      return dispatchProps.requestLicense(stateProps.vocab.id)
        .then(() => dispatchProps.close())
        .then(() => dispatchProps.openConfirmModal())
        .catch(() => {});
    },
  };
}

const ReduxModalWindow = ModalUtils.connect({ name: modal.requestLicense })(ModalRequestLicense);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
