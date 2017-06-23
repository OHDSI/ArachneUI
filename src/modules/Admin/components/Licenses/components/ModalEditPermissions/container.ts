import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import actions from 'modules/Admin/actions';
import { ModalUtils } from 'arachne-components';
import { modal, forms } from 'modules/Admin/const';
import { get, difference } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';

class ModalEditPermissions extends Component<{}, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any) {
  const vocabularies = selectors.getVocabularies(state);
  const user = get(state, 'modal.editPermission.data.user.name', 'anonymous');

	return {
    vocabularies,
    initialValues: {
      vocabularies: vocabularies.map(v => v.value.toString()),
    },
    user,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.editPermission, false),
  remove: actions.licenses.remove,
};

function mergeProps(
  stateProps,
  dispatchProps,
  ownProps
  ) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    doSubmit: ({ vocabularies }) => {
      const promises = [];
      difference(stateProps.initialValues.vocabularies, vocabularies).forEach((v) => {
        promises.push(dispatchProps.remove(v.licenseId));
      });
      const promise = Promise.all(promises);
      promise.then(() => dispatchProps.close())
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

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
