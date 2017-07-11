import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { apiPaths, forms, modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import { push as goToPage } from 'react-router-redux';
import { reduxForm, reset, FormProps, change as reduxFormChange } from 'redux-form';
import { ModalUtils } from 'arachne-components';
import presenter from './presenter';
import selectors from './selectors';

import {
	IResultsStateProps,
	IResultsDispatchProps,
	IResultsProps,
} from './presenter';
import {
	Vocabulary,
} from './selectors';

class Results extends Component<IResultsProps & FormProps<{}, {}, {}>, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IResultsStateProps {
	let vocabularies = selectors.getVocabs(state);
	let initialValues = {
		vocabulary: [],
	};
	// top checkbox is checked
	let areAllChecked = get(state, 'vocabulary.download.data.allChecked');
	vocabularies.forEach((vocabulary) => {
		initialValues.vocabulary[`${vocabulary.id}`] = areAllChecked === true
			? vocabulary.isCheckable
			: areAllChecked === false ? false : vocabulary.clickDefault;
	});

	const values = get(state, `form.${forms.download}.values.vocabulary`, []) || [];

	const selection = get(state, `form.${forms.downloadSettings}.values.selection`, 'all');
	if (selection !== 'all') {
		vocabularies = vocabularies.filter((v: Vocabulary) => get(values, `${v.id}`, false));
	}

	const selectedVocabularies = values.filter((vocabulary) => vocabulary === true);
	const selectableVocabularies = vocabularies.filter((vocabulary) => vocabulary.isCheckable === true);
	// every single checkbox is checked
	const areAllRowsChecked = selectedVocabularies.length === selectableVocabularies.length;

	vocabularies = vocabularies.map((vocabulary: Vocabulary) => ({
		...vocabulary,
		isChecked: values[vocabulary.id.toString()] === true,
	}));

	return {
		areAllChecked,
		areAllRowsChecked,
		initialValues,
		sorting: '',
		vocabularies,
	};
}

const mapDispatchToProps = {
	unselectAll: () => reset(forms.download),
	toggleAll: actions.download.toggleAllVocabs,
  toggle: (id: number, state: boolean) => reduxFormChange(forms.download, `vocabulary[${id}]`, state),
  openRequestModal: (vocab: Vocabulary) => ModalUtils.actions.toggle(modal.requestLicense, true, vocab),
};

function mergeProps(
	stateProps: IResultsStateProps,
	dispatchProps: IResultsDispatchProps
): IResultsProps {
	return {
		...stateProps,
		...dispatchProps,
		setSorting: () => {
      
    },
    toggleAllCheckboxes: () => dispatchProps.toggleAll(!stateProps.areAllChecked),
	};
}

const ResultsForm = reduxForm({
	form: forms.download,
	enableReinitialize: true,
})(Results);

export default connect<IResultsStateProps, IResultsDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ResultsForm);
