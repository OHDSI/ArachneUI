import API from 'services/Api';
import services from '../apiServices';

function load() {
	return services.buildInfo.find();
}

export default {
  load,
};
