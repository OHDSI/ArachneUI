/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: January 16, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { PageContent } from 'arachne-ui-components';
import Grid from 'components/Grid';

import ToolbarActions from './ToolbarActions';
import List from './List';

function ExpertsList(props) {
  const classes = new BEMHelper('expert-finder');
  const {
    isLoading,
    filterFields,
    paginationDetails,
    searchQueryDecode,
    searchQueryEncode,
  } = props;

  return (
    <PageContent title="Expert finder | Arachne">
      <div {...classes()}>
        <Grid
          isLoading={isLoading}
          title="Expert finder"
          filterFields={filterFields}
          Actions={<ToolbarActions />}
          paginationDetails={paginationDetails}
          searchQueryDecode={searchQueryDecode}
          searchQueryEncode={searchQueryEncode}
        >
          <List />
        </Grid>
      </div>
    </PageContent>
  );
}

ExpertsList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  filterFields: PropTypes.array,
  paginationDetails: PropTypes.object,
  searchQueryDecode: PropTypes.function,
  searchQueryEncode: PropTypes.function,
};

export default ExpertsList;
