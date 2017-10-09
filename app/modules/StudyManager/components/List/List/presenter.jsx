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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Pagination,
} from 'arachne-components';
import Table from './components/Table';
import Cards from './components/Cards';

require('./style.scss');

function ListStudies(props) {
  const {
    isCardsView = true,
  } = props;
  const classes = new BEMHelper('studies-list-content');

  return (
    <div {...classes()}>
      {isCardsView
        ? <Cards {...props} />
        : <Table {...props} />
      }
    </div>);
}

ListStudies.propTypes = {
  isCardsView: PropTypes.bool,
  createdFormatter: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  goToStudy: PropTypes.func.isRequired,
  linkFormatter: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  sorting: PropTypes.object.isRequired,
  statusFormatter: PropTypes.func.isRequired,
  typeFormatter: PropTypes.func.isRequired,
  pages: PropTypes.number,
  currentPage: PropTypes.currentPage,
  path: PropTypes.string,
  resultsCountMessage: PropTypes.bool,
};

export default ListStudies;
