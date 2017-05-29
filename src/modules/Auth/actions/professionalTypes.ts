import services from '../apiServices';

function load() {
  return services.auth_professionalTypes.find();
}

export default {
  load,
};
