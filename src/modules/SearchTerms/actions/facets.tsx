import API from 'services/Api';
import services from '../apiServices';

import { searchParams } from './termList';

function updateFacets(query: searchParams) {
  return services.facets.find({ query });
}

export default {
  updateFacets,
};
