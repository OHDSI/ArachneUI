import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawProfessionalTypes = (state: Object) => {
  return <any[]> get(state, 'auth.professionalTypes.queryResult.result') || [];
}

const getProfessionalTypes = createSelector(
  getRawProfessionalTypes,
  rawProfessionalTypes => rawProfessionalTypes.map(type => ({
    label: type.name,
    value: type.id,
  }))
);

export default {
  getProfessionalTypes,
};
