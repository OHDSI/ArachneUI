import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.auth_principal.get('');
}

export default {
  load,
};
