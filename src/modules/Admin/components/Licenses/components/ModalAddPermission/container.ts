import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-components';
import { modal, forms } from 'modules/Admin/const';
import { get } from 'lodash';
import { reduxForm, reset } from 'redux-form';
import actions from 'modules/Admin/actions';
import presenter from './presenter';
import selectors, { UserOption } from './selectors';
import { Vocabulary } from 'modules/Admin/components/Licenses/types';

interface IModalStateProps {
  vocabularies: Array<Vocabulary>;
	users: Array<UserOption>;
	userId: number;
	isOpened: boolean;
};
interface IModalDispatchProps {
  close: () => (dispatch: Function) => any;
  remove: (id: string) => (dispatch: Function) => any;
  getUsers: () => (dispatch: Function) => any;
	getVocabularies: (userId: number) => (dispatch: Function) => any;
	create: (user: number, vocabulary: Vocabulary) => (dispatch: Function) => any;
	resetForm: () => (dispatch: Function) => any;
	loadLicenses: () => (dispatch: Function) => any;
};
interface IModalProps extends IModalStateProps, IModalDispatchProps {
  doSubmit: (vocabs: Array<Vocabulary>) => Promise<any>;
};

class ModalAddPermission extends Component<IModalProps, {}> {
	componentWillReceiveProps(nextProps) {
		if (this.props.userId !== nextProps.userId && nextProps.userId) {
			this.props.getVocabularies(nextProps.userId);
		}
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: any): IModalStateProps {
	const users = selectors.getUsers(state);
	const userId = get(state, 'form.addPermission.values.user', -1);
	const vocabularies = userId > -1 ? selectors.getVocabularies(state) : [];
	const isOpened = get(state, 'modal.addPermission.isOpened', false);
  
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
				.then(() => dispatchProps.resetForm())
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

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)
(ReduxModalWindow);
