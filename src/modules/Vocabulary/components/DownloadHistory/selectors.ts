import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as moment from 'moment';
import BEMHelper from 'services/BemHelper';
import { IDownloadRequest, IVocabulary, IHistoryItem } from './presenter';

const getRawHistory = (state: Object) => get(state, 'vocabulary.history.queryResult') || [];

const getHistory = createSelector(
    getRawHistory,
    (rawResults: Array<IDownloadRequest>) => {
      const classes = BEMHelper('download-history');

      const history = [];
      let isHighlighted = false;
      rawResults.map((item: IDownloadRequest) => {
        item.vocabularies.map((voc: IVocabulary, index: number) => {
          let row: IHistoryItem = {
            ...voc,
            tableRowClass: classes({ element: 'row', modifiers: { selected: isHighlighted } }).className,
          };
          if (index === 0) {
            row.date = moment(item.date).format('DD/MM/YY');
            row.link = item.link;
          }
          history.push(row);
        });
        isHighlighted = !isHighlighted;
      });
      return history;
    },
  );

export default {
  getHistory,
};