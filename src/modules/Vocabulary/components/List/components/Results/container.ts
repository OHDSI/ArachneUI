/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { apiPaths, forms, modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import { push as goToPage } from 'react-router-redux';
import { reduxForm, reset, FormProps, change as reduxFormChange } from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import { isEmpty } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';

import {
	IResultsStateProps,
	IResultsDispatchProps,
	IResultsProps,
	IResultsOwnProps,
} from './presenter';
import {
	Vocabulary,
} from './selectors';

class Results extends Component<IResultsProps & FormProps<{}, {}, {}> & IResultsOwnProps, void> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object, ownProps: any): IResultsStateProps {
	let vocabularies = selectors.getVocabs(state);
	let initialValues = {
		vocabulary: [],
	};
	// top checkbox is checked
	let areAllChecked = get(state, 'vocabulary.download.data.allChecked');
	vocabularies.forEach((vocabulary) => {
		if (areAllChecked === true) {
			initialValues.vocabulary[`${vocabulary.id}`] = vocabulary.isCheckable;
		} else if (areAllChecked === false) {
			initialValues.vocabulary[`${vocabulary.id}`] = false;
		} else {
			// undefined
			initialValues.vocabulary[`${vocabulary.id}`] = vocabulary.clickDefault;
		}
	});

	if (!isEmpty(ownProps.predefinedVocabs)) {
		initialValues.vocabulary = [];
		ownProps.predefinedVocabs.forEach(vocabId => {
			initialValues.vocabulary[vocabId] = true;
		});
	}

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
	dispatchProps: IResultsDispatchProps,
	ownProps: IResultsOwnProps
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

export default connect<IResultsStateProps, IResultsDispatchProps, IResultsOwnProps>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ResultsForm);
