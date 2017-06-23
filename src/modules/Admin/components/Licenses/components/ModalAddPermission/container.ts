import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-components';
import { modal, forms } from 'modules/Admin/const';
import { get } from 'lodash';
import { reduxForm, reset } from 'redux-form';
import actions from 'modules/Admin/actions';
import presenter from './presenter';
import selectors from './selectors';

class ModalAddPermission extends Component<{}, {}> {
	componentWillReceiveProps(nextProps) {
		if (this.props.userId !== nextProps.userId && nextProps.userId) {
			this.props.getVocabularies(nextProps.userId);
		}
		if (this.props.isOpened === false && nextProps.isOpened === true) {
			this.props.resetForm();
		}
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: any) {
	const vocabularies = selectors.getVocabularies(state);
	const users = selectors.getUsers(state);
	const userId = get(state, 'form.addPermission.values.user');
	const isOpened = get(state, 'modal.addPermission.isOpened');
  
	return {
		vocabularies,
		users,
		userId,
		isOpened,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.addPermission, false),
  getUsers: actions.licenses.getUsers,
	getVocabularies: actions.licenses.getVocabularies,
	create: actions.licenses.create,
	resetForm: () => reset(forms.addPermission),
	loadLicenses: actions.licenses.load,
};


function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		doSubmit: ({ user, vocabulary }) => {
			const promise = dispatchProps.create(user, vocabulary);
			promise
				.then(() => dispatchProps.close())
				.then(() => dispatchProps.loadLicenses())
				.catch(() => {});

			return promise;
		},
	};
}

let ReduxModalWindow = reduxForm({
	form: forms.addPermission,
})(ModalAddPermission);
ReduxModalWindow = ModalUtils.connect({ name: modal.addPermission })(ReduxModalWindow);

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)
(ReduxModalWindow);
