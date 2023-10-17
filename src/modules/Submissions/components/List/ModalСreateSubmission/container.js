import React from 'react';
import { reset as resetForm, getFormValues, change as reduxFormChange } from 'redux-form';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal, sections, getTypeByShortPrefix } from 'modules/Submissions/const';
import Presenter from './presenter';
import selectors from './selectors';
import { get, buildFormData, ContainerBuilder, packFilesInZip } from 'services/Utils';
import JSZip from 'jszip';

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
      environmentList: selectors.getEnvironmentList(state),
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
      setEntryPoint: value => reduxFormChange(forms.createSubmission, 'executableFileName', value),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit({ file: files, datasourceId, title, study, executableFileName, environmentId, type }) {
        const { activeTab } = stateProps;
        const isFilesTab = activeTab === sections.FILES || activeTab === sections.STRATEGUS;
        let file;
        if (isFilesTab) {
          file = await packFilesInZip(files);
        } else {
          file = files[0];
        }
        const data = buildFormData({ file }, { analysis: { executableFileName, datasourceId, title, study, type, environmentId } });
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
          const isFilesTab = activeTab === sections.FILES || activeTab === sections.STRATEGUS;
          let options;
          if (isFilesTab) {
            options = files.map(({ name }) => name);
          } else {
            const zip = await JSZip.loadAsync(files[0]);
            const metaFile = zip.files['analysisMetadata.json'];
            if (metaFile) {
              const metaJson = await metaFile.async('string');
              const meta = JSON.parse(metaJson);
              dispatchProps.setAnalysisName(meta.analysisName);
              dispatchProps.setStudyName(meta.studyName);
              dispatchProps.setEntryPoint(meta.entryPoint);
              dispatchProps.setAnalysisType(meta.analysisType)
            } else {
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
            const items = [];
            zip.forEach(file => items.push(file));
            options = items;
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
