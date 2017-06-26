import { createSelector } from 'reselect';
import { get } from 'lodash';
import { License, Vocabulary } from 'modules/Admin/components/Licenses/types';

const getRawData = (state: Object) => get(state, 'admin.licenses.queryResult.content', []) || [];

const getLicenses = createSelector(
    getRawData,
    (rawResults: Array<any>): Array<License> => rawResults.map((license: any) => ({
      	user: {
      		id: license.user.id,
      		name: [license.user.firstName, license.user.middleName, license.user.lastName].filter(n => n).join(' '),
      	},
      	vocabularies: license.vocabularyDTOs,
    })),
  );

export default {
  getLicenses,
};
