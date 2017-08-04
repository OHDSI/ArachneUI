import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as moment from 'moment';

interface Vocabulary {
  code: string;
  id: number;
  name: string;
  available: boolean;
  update: string;
  index: number;

  isCheckable: boolean;
  isChecked: boolean;
  tableRowClass: string;
  status: string;
  clickDefault: boolean;
};

const getRawVocabs = (state: Object) => get(state, 'vocabulary.vocabularies.queryResult') || [];

const getVocabs = createSelector(
    getRawVocabs,
    (rawResults: Array<Vocabulary>) => rawResults.map((vocabulary: Vocabulary, index: number) => ({
      ...vocabulary,
      update: vocabulary.update ? moment(vocabulary.update).format('DD-MMM-YYYY') : '',
      isChecked: false,
      isCheckable: vocabulary.available === true,
      // for redux-form
      index,
    })),
  );

export default {
  getVocabs,
};

export { Vocabulary };
