/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { get } from 'lodash';
import presenter from './presenter';
import { resultsPageSize } from 'modules/Vocabulary/const';
import * as URI from 'urijs';
import { isEmpty } from 'lodash';

import {
  IListStateProps,
  IListDispatchProps,
  IListProps,
} from './presenter';

class VocabsList extends Component<IListProps, void> {
  componentWillMount() {
    this.props.load();
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: any): IListStateProps {
  let predefinedVocabs = get(ownProps.router.location.query, 'request', []);
  if (!isEmpty(predefinedVocabs) && !Array.isArray(predefinedVocabs)) {
    // if there's only one required license
    predefinedVocabs = [predefinedVocabs];
  }

  return {
    isLoading: get(state, 'vocabulary.vocabularies.isLoading', false),
    predefinedVocabs,
  };
}

const mapDispatchToProps = {
  load: actions.vocabularies.load,
};

export default connect<IListStateProps, IListDispatchProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(VocabsList);
