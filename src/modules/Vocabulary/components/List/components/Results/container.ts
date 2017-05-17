import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { apiPaths, forms } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import { push as goToPage } from 'react-router-redux';
import { reduxForm, reset, FormProps, change as reduxFormChange } from 'redux-form';
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
	let initialValues = {};
	// top checkbox is checked
	let areAllChecked = get(state, 'vocabulary.download.data.allChecked', false);
	if (areAllChecked) {
		initialValues = {
			vocabulary: vocabularies.map((vocabulary) => vocabulary.isCheckable ? true : false),
		};
	}

	const values = get(state, `form.${forms.download}.values.vocabulary`, []);

	const selection = get(state, `form.${forms.downloadSettings}.values.selection`, 'all');
	if (selection !== 'all') {
		vocabularies = vocabularies.filter((v: Vocabulary) => get(values, `${v.id}`, false));
	}

	// add modifiers for Table component
	vocabularies.map((vocabulary) => {
		vocabulary.tableRowMods = {
			selected: get(values, `${vocabulary.id}`, false),
		};	
	});

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
