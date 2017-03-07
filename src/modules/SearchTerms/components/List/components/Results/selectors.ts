import { createSelector } from 'reselect';
import { get } from 'lodash';
import { resultsPageSize } from 'modules/SearchTerms/const';

const getRawResults = (state: Object) => {
  const r = [];
  const pageSize = get(state, 'searchTerms.termList.data.pageSize', resultsPageSize);
  for(let i=1; i<pageSize; i++) {
    r.push({
      id: i,
      code: `OMOP${i}`,
      name: i%2===0?`Very long name that will not even fit this column and probably go to the second line, like Drug #${i}` : `Drug #${i}`,
      class: 'Quant Clinical Drug',
      rc: 'timeout',
      drc: 'timeout',
      domain: 'Drug',
      vocabulary: 'RxNorm Extension',
      link: 'http://yahoo.eu',
    });
  }
  return r;
};

const getResults = createSelector(
    getRawResults,
    rawResults => rawResults,
  );

export default {
  getResults,
};
