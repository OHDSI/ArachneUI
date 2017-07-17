import { createSelector } from 'reselect';
import { get, has } from 'lodash';
import { defaultLevels, defaultStandardsOnly, defaultZoomLevel } from 'modules/SearchTerms/const';

const getRawLocation = (state: Object) => get(state, 'routing.locationBeforeTransitions', {
  pathname: '',
  query: null,
});

const getTermFilters = createSelector(
  getRawLocation,
  location => {
    return {
      levels: has(location.query, 'levels') ? location.query.levels : defaultLevels,
      standardsOnly: has(location.query, 'standardsOnly')
        ? location.query.standardsOnly === 'true'
        : defaultStandardsOnly,
      zoomLevel: has(location.query, 'zoomLevel')
      ? parseInt(location.query.zoomLevel, 0)
      : defaultZoomLevel,
    };
  }
);

export {
  getTermFilters,
}