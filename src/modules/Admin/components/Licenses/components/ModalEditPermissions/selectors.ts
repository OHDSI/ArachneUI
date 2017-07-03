import { createSelector } from 'reselect';
import { get } from 'lodash';
import { licenseStatuses } from 'const/vocabulary';

const getRawVocs = (state: Object) => get(state, 'modal.editPermission.data.vocabularies', []) || [];

const getVocabularies = createSelector(
    getRawVocs,
    (rawResults: Array<any>) => rawResults
	    .filter(voc => voc.status === licenseStatuses.APPROVED)
	    .map((voc) => ({
	      label: voc.name,
	      value: voc.licenseId,
	    })),
  );
const getPendingVocabularies = createSelector(
	getRawVocs,
	(rawResults: Array<any>) => rawResults
		.filter(voc => voc.status === licenseStatuses.PENDING),
);

export default {
  getVocabularies,
  getPendingVocabularies,
};