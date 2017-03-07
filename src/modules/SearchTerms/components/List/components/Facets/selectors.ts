import { createSelector } from 'reselect';
import get from 'lodash/get';
import types from 'const/metadataTypes';

const getRawFacets = (state: Object) => {
  const r = [
    {
      faceted: true,
      label: 'Facet section #2',
      name: 'Facet #2',
      max: 10000,
      min: 0,
      type: types.integer,
    },
    {
      faceted: true,
      label: 'Facet section #3',
      name: 'Facet #3',
      options: [
        {
          facetCount: 1,
          label: 'one',
          value: 'val1',
        },
        {
          facetCount: 1,
          label: 'two',
          value: 'val2',
        },
        {
          facetCount: 1,
          label: 'three',
          value: 'val3',
        },
      ],
      type: types.enum,
    },
  ];
  return r;
};

const getFacets = createSelector(
    getRawFacets,
    rawFacets => rawFacets,
  );

export default {
  getFacets,
};
