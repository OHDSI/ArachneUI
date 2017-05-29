import services from '../apiServices';
import { push as goToPage } from 'react-router-redux';

function load() {
  return services.auth_principal.get('me');
}

function register(data) {
  return services.auth_principal.create(data);
}

export default {
  load,
};
export {
	load,
  register,
};
