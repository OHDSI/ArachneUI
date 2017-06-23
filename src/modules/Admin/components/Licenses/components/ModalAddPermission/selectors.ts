import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawVocs = (state: Object) => get(state, 'admin.vocabularies.queryResult', []) || [];
const getRawUsers = (state: Object) => get(state, 'admin.users.queryResult', []) || [];

const getVocabularies = createSelector(
    getRawVocs,
    (rawResults: Array<any>) => rawResults.filter(voc => voc.required).map((voc) => ({
      label: voc.name,
      value: voc.id,
    })),
);

const getUsers = createSelector(
	getRawUsers,
	rawUsers => rawUsers.map(user => ({
		label: [user.lastName, user.firstName, user.middleName].join(' '),
		value: user.id,
	}))
);

export default {
  getVocabularies,
  getUsers,
};