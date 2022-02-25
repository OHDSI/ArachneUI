import React from 'react';
import PropTypes from 'prop-types';
import { reset as resetForm, getFormValues, change as reduxFormChange } from 'redux-form';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal, sections, getTypeByShortPrefix } from 'modules/Submissions/const';
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
      setAnalysisName: value => reduxFormChange(forms.createSubmission, 'title', value),
      setAnalysisType: value => reduxFormChange(forms.createSubmission, 'type', value),
      setStudyName: value => reduxFormChange(forms.createSubmission, 'study', value),
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
        const submitPromise = dispatchProps.createSubmission(null, data);
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
      async populateData(files, callback) {
        callback(files);
        try {
          const { activeTab } = stateProps;
          const isFilesTab = activeTab === sections.FILES;
          let options;
          if (isFilesTab) {
            options = files.map(({ name }) => name);
          } else {
            options = await getFileNamesFromZip(files[0]);
            const fileName = files[0];
            const originalName = fileName.originalName.replace(/\.zip$/, '').replace(/-code$/, '');
            const parts = originalName.split("-");
            if (parts.length > 1) {
              const type = getTypeByShortPrefix(parts[0]);
              dispatchProps.setAnalysisType(type);
              const name = parts[1];
              if (parts.length > 2) {
                const offset = parts[0].length + name.length + 2;
                dispatchProps.setStudyName(name);
                dispatchProps.setAnalysisName(originalName.substring(offset));
              } else {
                dispatchProps.setAnalysisName(name);
              }
            } else {
              dispatchProps.setAnalysisName(originalName);
            }
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
