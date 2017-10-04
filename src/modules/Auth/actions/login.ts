import services from '../apiServices';

function remindPassword(email) {
  return services.remind_password.create({
    email,
  });
}

function resetPassword({ password, email, token }) {
  return services.reset_password.create({
    password,
    email,
    token,
  });
}

export default {
  remindPassword,
  resetPassword,
};
