import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/Vocabulary/const';
import { IAppAction } from 'actions';

function load() {
  return services.history.find();
}

export default {
  load
};
