import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as moment from 'moment';

interface Vocabulary {
  code: string;
  id: number;
  name: string;
  required: boolean;
  update: string;
  index: string;

  isCheckable: boolean;
  isChecked: boolean;
  tableRowMods: {
    selected: boolean;
  };
};

const getRawVocabs = (state: Object) => get(state, 'vocabulary.vocabularies.queryResult.content', []);

const getVocabs = createSelector(
    getRawVocabs,
    (rawResults) => rawResults.map((vocabulary: Vocabulary, index: number) => ({
      ...vocabulary,
      update: vocabulary.update ? moment(vocabulary.update).format('DD-MMM-YYYY') : '',
      isChecked: false,
      isCheckable: vocabulary.required === null,
      // for redux-form
      index,
    })),
  );

export default {
  getVocabs,
};

export { Vocabulary };