/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import API, { ohdsiApi } from 'services/Api';
import services from '../apiServices';
import { apiPaths } from 'modules/Vocabulary/const';

function load() {
  return services.history.find();
}

function remove(id: number) {
  return services.history.remove(id);
}

function restore(id: number) {
	return services.restore.update(id, {});
}

function share(values: string, id: number) {
  return (dispatch: Function) => {
    return ohdsiApi.doPost(apiPaths.share(id), values);
  };
}

export default {
  load,
  remove,
  restore,
  share,
};
