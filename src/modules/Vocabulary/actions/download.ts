import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/Vocabulary/const';
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
};
export { DownloadParams };
