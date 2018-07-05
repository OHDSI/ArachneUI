/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

import { actionTypes, apiPaths } from 'modules/Vocabulary/const';
import { IAppAction } from 'actions';

type DownloadParams = {
	cdmVersion: string;
	ids: string;
  name: string;
};

function toggleVocabsList(value: boolean): IAppAction<{ allChecked: boolean }> {
  return {
    type: actionTypes.ALL_VOCABS_TOGGLED,
    payload: {
      allChecked: value,
    },
  };
}

function toggleAllVocabs(value: boolean) {
  return (dispatch: Function) => dispatch(toggleVocabsList(value));
}

function checkBundleAvailability(id: string) {
  return (dispatch: Function) => {
    return ohdsiApi.doGet(apiPaths.availability(id));
  };
}

function requestDownload(downloadParams: DownloadParams) {
	return services.download.find({ query: downloadParams });
}

function requestNotification(props: { notify: boolean, vocabularyV4Id: number }) {
  const { notify, vocabularyV4Id } = props;
  return services.notifications.create({ notify, vocabularyV4Id });
}

function getNotifications() {
  return services.notifications.find();
}

export default {
  toggleAllVocabs,
  requestDownload,
  requestNotification,
  getNotifications,
  checkBundleAvailability,
};
export { DownloadParams };
