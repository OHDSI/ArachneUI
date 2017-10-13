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
 * Created: July 17, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { PageContent } from 'arachne-ui-components';
import Grid from 'components/Grid';
import Actions from './Actions';
import List from './List';

function InsightsList(props) {
  const {
    isLoading,
    filterFields,
    paginationDetails,
  } = props;
  const classes = new BEMHelper('insights-list');

  return (
    <PageContent title="Insights library | Arachne">
      <div {...classes()}>
        <Grid
          isLoading={isLoading}
          title="Insights library"
          filterFields={filterFields}
          Actions={<Actions />}
          paginationDetails={paginationDetails}
        >
          <List />
        </Grid>
      </div>
    </PageContent>
  );
}

export default InsightsList;
