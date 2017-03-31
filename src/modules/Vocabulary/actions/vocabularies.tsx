import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.vocabularies.find({ test: 'string' });
}

export default {
  load,
};
