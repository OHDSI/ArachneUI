import services from '../apiServices';

function remindPassword(email) {
  return services.remind_password.create({
    email
  });
}

export default {
  remindPassword,
};
