import { Component } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import actions from 'modules/Vocabulary/actions';
import { reduxForm, change as reduxFormChange, SubmissionError, reset } from 'redux-form';
import { ModalUtils } from 'arachne-components';
import { modal, forms, paths, cdmVersions } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import selectors from 'modules/Vocabulary/components/List/components/Results/selectors';
import presenter from './presenter';
import { IModalProps, IModalStateProps, IModalDispatchProps } from './presenter';

class ModalConfirmDownload extends Component<IModalProps, {}> {
  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened !== nextProps.isOpened && nextProps.isOpened === true) {
      this.props.reset();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const formSelectedVocabularies = get(state, `form.${forms.download}.values.vocabulary`, []);
  const selectedVocabIds = [];
  formSelectedVocabularies.map((voc: any, id: number) => {
    if (voc === true) {
      selectedVocabIds.push(id);
    }
  });
  const vocabs = selectors.getVocabs(state);
  const selectedVocabs = vocabs.filter(voc => selectedVocabIds.includes(voc.id));
  const isOpened = get(state, `modal.${modal.download}.isOpened`, false);

	return {
    selectedVocabs,
    selectedVocabIds,
    isOpened,
    initialValues: {
      cdmVersion: cdmVersions[cdmVersions.length - 1].value,
    },
  };
}

const mapDispatchToProps = {
  requestDownload: actions.download.requestDownload,
  remove: (id: number) => reduxFormChange(forms.download, `vocabulary[${id}]`, false),
  close: () => ModalUtils.actions.toggle(modal.download, false),
  showResult: () => ModalUtils.actions.toggle(modal.downloadResult, true),
  reset: () => reset(forms.bundle),
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
    removeVocabulary: (id: number) => {
      dispatchProps.remove(id);
      if (stateProps.selectedVocabs.length === 1) {
        dispatchProps.close();
      }
    },
    download: ({ bundleName, cdmVersion }) => {
      const promise = dispatchProps.requestDownload({
        cdmVersion: cdmVersion,
        ids: stateProps.selectedVocabIds.join(','),
        name: bundleName,
      })
      .then(() => dispatchProps.close())
      .then(() => dispatchProps.showResult())
      .catch(({ message }) => {
        throw new SubmissionError({
          _error: message,
        });
      });

      return promise;
    },
  };
}

let ReduxModalWindow = reduxForm({ form: forms.bundle })(ModalConfirmDownload);
ReduxModalWindow = ModalUtils.connect({ name: modal.download })(ReduxModalWindow);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
