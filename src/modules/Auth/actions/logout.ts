import services from '../apiServices';

function logout() {
  return services.auth_logout.find();
}

export default {
  logout,
};
