import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/Vocabulary/const';
import { IAppAction } from 'actions';

type DownloadParams = {
	cdm_version: string;
	ids: Array<string>;
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

export default {
  toggleAllVocabs,
  requestDownload,
};
export { DownloadParams };
