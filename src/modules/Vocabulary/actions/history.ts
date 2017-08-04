import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.history.find();
}

function remove(id: number) {
  return services.history.remove(id);
}

function restore(id: number) {
	return services.restore.update(id, {});
}

export default {
  load,
  remove,
  restore,
};
