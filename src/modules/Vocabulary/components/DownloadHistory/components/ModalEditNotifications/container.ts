import { Component } from 'react';
import { connect } from 'react-redux';
import actions from 'modules/Vocabulary/actions';
import { reduxForm, change as reduxFormChange } from 'redux-form';
import { ModalUtils } from 'arachne-components';
import { modal, forms } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import selectors from 'modules/Vocabulary/components/List/components/Results/selectors';
import presenter from './presenter';
import { IModalProps, IModalStateProps, IModalDispatchProps } from './presenter';

class ModalEditNotifications extends Component<IModalProps, {}> {
  componentWillReceiveProps(nextProps) {
    if(this.props.isOpened === false && nextProps.isOpened === true) {
      this.props.getNotifications();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const isOpened = get(state, `modal.${modal.notifications}.isOpened`, false);
  const selectedVocabs = get(state, 'vocabulary.notifications.queryResult', []);
  const isLoading = get(state, 'vocabulary.notifications.isLoading', false);

	return {
    isOpened,
    selectedVocabs,
    isLoading,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.notifications, false),
  notify: actions.download.requestNotification,
  getNotifications: actions.download.getNotifications,
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
    removeVocabulary: (vocabularyV4Id: number) => {
      dispatchProps.notify({ notify: false, vocabularyV4Id })
        .then(() => dispatchProps.getNotifications()
          .then(() => {
            if (stateProps.selectedVocabs.length === 1) { // was 1
              dispatchProps.close();
            }
          })
        );
    },
  };
}

let ReduxModalWindow = reduxForm({ form: forms.notifications })(ModalEditNotifications);
ReduxModalWindow = ModalUtils.connect({ name: modal.notifications })(ReduxModalWindow);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
