import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawData = (state: Object) => get(state, 'admin.licenses.queryResult.content', []) || [];

const getLicenses = createSelector(
    getRawData,
    (rawResults: Array<any>) => rawResults.map((license) => ({
      	...license,
      	user: {
      		id: license.user.id,
      		name: [license.user.lastName, license.user.firstName, license.user.middleName].join(' '),
      	},
      	vocabularies: license.vocabularyDTOs,
    })),
  );

export default {
  getLicenses,
};