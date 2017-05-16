import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as moment from 'moment';
import BEMHelper from 'services/BemHelper';
import { IDownloadRequest, IVocabulary, IHistoryItem } from './presenter';

const getRawHistory = (state: Object) => get(state, 'vocabulary.history.queryResult') || [];

const getHistory = createSelector(
    getRawHistory,
    (rawResults: Array<IDownloadRequest>) => rawResults.map((bundle: IDownloadRequest) => ({
      ...bundle,
      vocabularies: bundle.vocabularies.map((voc: IVocabulary) => ({
        ...voc,
        cdmVersion: `CDM ${bundle.cdmVersion}`,
      }))
    })),
  );

export default {
  getHistory,
};