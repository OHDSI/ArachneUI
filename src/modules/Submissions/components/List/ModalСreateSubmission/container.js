import React from 'react';
import PropTypes from 'prop-types';
import { reset as resetForm, getFormValues } from 'redux-form';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal, sections } from 'modules/Submissions/const';
import Presenter from './presenter';
import selectors from './selectors';
import { get, buildFormData, ContainerBuilder, getFileNamesFromZip, packFilesInZip } from 'services/Utils';

class ModalCreateSubmissionBuilder extends ContainerBuilder {
  getComponent() {
    return Presenter;
  }

  isFormValid(state) {
    const formValues = getFormValues(this.getFormParams().form)(state);
    return formValues
      && formValues.file
      && formValues.file.length > 0
      && formValues.datasourceId
      && formValues.title
      && formValues.executableFileName
      && formValues.type;
  }

  mapStateToProps(state) {
    return {
      isOpened: get(state, `modal.${modal.createSubmission}.isOpened`, false),
      entryPointsOptionList: selectors.getEntryPointsOptionList(state),
      isFormValid: this.isFormValid(state),
      dataSourcesOptionList: selectors.getDataSourcesOptionList(state),
      analysisTypesOptionList: selectors.getAnalysisTypesOptionList(state),
      activeTab: get(state, 'submissions.tabs.activeTab'),
    };
  }

  getMapDispatchToProps() {
    return {
      createSubmission: actions.submissions.analyses.create,
      setEntryPointsOptionList: (options) => actions.submissions.entryPointsOptionList.set(options),
      setActiveTab: (tab) => actions.submissions.tabs.set(tab),
      closeModal: () => ModalUtils.actions.toggle(modal.createSubmission, false),
      resetForm: resetForm.bind(null, forms.createSubmission),
      loadSubmissionList: actions.submissions.submissionList.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit({ file: files, datasourceId, title, study, executableFileName, type }) {
        const { activeTab } = stateProps;
        const isFilesTab = activeTab === sections.FILES;
        let file;
        if (isFilesTab) {
          file = await packFilesInZip(files);
        } else {
          file = files[0];
        }
        const data = buildFormData({ file }, { analysis: { executableFileName, datasourceId, title, study, type } });
        const submitPromise = await dispatchProps.createSubmission(null, data);
        try {
          await submitPromise;
          dispatchProps.closeModal();
          dispatchProps.resetForm();
          dispatchProps.loadSubmissionList({ query: null });
        } catch (err) {
          console.error(err);
        }

        return submitPromise;
      },
      async populateEntryPointsOptionList(files, callback) {
        callback(files);
        try {
          const { activeTab } = stateProps;
          const isFilesTab = activeTab === sections.FILES;
          let options;
          if (isFilesTab) {
            options = files.map(({ name }) => name);
          } else {
            options = await getFileNamesFromZip(files[0]);
          }
          dispatchProps.setEntryPointsOptionList(options);
        } catch (err) {
          console.error(err);
        }
      },
      clearAndClose() {
        dispatchProps.resetForm();
        dispatchProps.closeModal();
      },
    };
  }

  getModalParams() {
    return {
      name: modal.createSubmission,
    }
  }

  getFormParams() {
    return {
      form: forms.createSubmission,
    }
  }
}


export default ModalCreateSubmissionBuilder;
