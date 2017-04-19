import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.history.find();
}

export default {
  load,
};
