import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawVocs = (state: Object) => get(state, 'modal.editPermission.data.vocabularies', []) || [];

const getVocabularies = createSelector(
    getRawVocs,
    (rawResults: Array<any>) => rawResults.map((voc) => ({
      label: voc.name,
      value: voc.licenseId,
    })),
  );

export default {
  getVocabularies,
};