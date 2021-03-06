/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: April 12, 2017
 *
 */

import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { adminPages } from 'modules/Admin/const';
import sortBy from 'lodash/sortBy';
import Toolbar from './presenter';

const sortedAdminPages = sortBy(adminPages, ['label']);

function mapStateToProps(state) {
  return {
    currentPage: state.routing.locationBeforeTransitions.pathname,
    pages: sortedAdminPages,
  };
}

const mapDispatchToProps = {
  goToPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
