import { Component } from 'react';
import { reset as resetForm } from 'redux-form';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal } from 'modules/Submissions/const';
import presenter from './presenter';
import selectors from './selectors';
import { get, buildFormData, ContainerBuilder, getFileNamesFromZip } from 'services/Utils';

class ModalCreateSubmission extends Component {

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadDataSourcesOptionList();
    }
  }

  render() {
    return presenter(this.props);
  }
}

class ModalCreateSubmissionBuilder extends ContainerBuilder {

  getComponent() {
    return ModalCreateSubmission;
  }

  mapStateToProps(state) {
    return {
      isOpened: get(state, `modal.${modal.createSubmission}.isOpened`, false),
      entryPointsOptionList: selectors.getEntryPointsOptionList(state),
      dataSourcesOptionList: selectors.getDataSourcesOptionList(state),
    };
  }

  getMapDispatchToProps() {
    return {
      createSubmission: actions.submissions.analyses.create,
      setEntryPointsOptionList: (options) => actions.submissions.entryPointsOptionList.set(options),
      closeModal: () => ModalUtils.actions.toggle(modal.createSubmission, false),
      loadDataSourcesOptionList: actions.submissions.dataSourcesOptionList.query,
      resetForm: resetForm.bind(null, forms.createSubmission),
      loadSubmissionList: actions.submissions.submissionList.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit({ file: files, datasourceId, title, study, executableFileName }) {
        const file = Array.isArray(files) && files.length > 0 ? files[0] : null;
        const data = buildFormData({ file }, { analysis: { executableFileName, datasourceId, title, study } });
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
      async populateEntryPointsOptionList(files, callback) {
        callback(files);
        const options = await getFileNamesFromZip(files[0]);
        dispatchProps.setEntryPointsOptionList(options);
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
