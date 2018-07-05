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
import actions from 'modules/SearchTerms/actions';
import { get } from 'lodash';
import presenter from './presenter';
import { resultsPageSize } from 'modules/SearchTerms/const';
import * as URI from 'urijs';
import {
	ISearchTermProps,
} from './presenter';

interface ISearchTermDispatchProps {
	loadTerms: Function,
}

class List extends Component<ISearchTermProps & ISearchTermDispatchProps, {}> {
	componentWillMount() {
		this.props.loadTerms(URI.parseQuery(this.props.searchStr));
	}

	componentWillReceiveProps(props: ISearchTermProps) {
		if (this.props.searchStr !== props.searchStr) {
      this.props.loadTerms(URI.parseQuery(props.searchStr));
    }
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): ISearchTermProps {

	return {
    searchStr: get(state, 'routing.locationBeforeTransitions.search', ''),
		isLoading: get(state, 'searchTerms.terms.isLoading', false),
	};
}

const mapDispatchToProps = {
	loadTerms: actions.termList.load,
};

export default connect<ISearchTermProps, ISearchTermDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(List);
