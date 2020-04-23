/*
 *
 * Copyright 2020 Odysseus Data Services, inc.
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
 * Authors: Alex Cumarav
 * Created: April 20, 2020
 *
 */

import presenter, {ISearchOverviewProps, ISearchOverviewOwnProps, ISearchOverviewStateProps, ISearchOverviewDispatchProps} from './presenter';
import { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { push as goToPage } from 'react-router-redux';
import { get } from 'lodash';
import * as URI from 'urijs';
import * as numeral from 'numeral';
import { forms, paths } from 'modules/SearchTerms/const';
import actions from 'modules/SearchTerms/actions';

class SearchOverview extends Component<ISearchOverviewProps, ISearchOverviewOwnProps> {

    componentDidMount(): void {
        this.props.fetchTermsCount();
    }

    render() {
        return presenter(this.props);
    }
}

function mapStateToProps(state: Object) :ISearchOverviewStateProps {
    const drugCount = numeral(get(state,'searchTerms.termsCount.queryResult.Drug',0)).format('0,0');
    const conditionCount = numeral(get(state,'searchTerms.termsCount.queryResult.Condition',0)).format('0,0');
    const procedureCount = numeral(get(state,'searchTerms.termsCount.queryResult.Procedure',0)).format('0,0');
    const deviceCount = numeral(get(state,'searchTerms.termsCount.queryResult.Device',0)).format('0,0');
    const observationCount = numeral(get(state,'searchTerms.termsCount.queryResult.Observation',0)).format('0,0');
    const measurementCount = numeral(get(state,'searchTerms.termsCount.queryResult.Measurement',0)).format('0,0');

    return {drugCount,
        conditionCount,
        procedureCount,
        deviceCount,
        observationCount,
        measurementCount};
}

const mapDispatchToProps = {
    goToAddress: (address: string) => goToPage(address),
    fetchTermsCount: actions.termList.fetchTermsCount,
}

function mergeProps(stateProps: ISearchOverviewStateProps, dispatchProps: ISearchOverviewDispatchProps, ownProps: ISearchOverviewOwnProps) {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        runQuerySearch: ({searchString}) => {
            console.log("runQuerySearch: ",searchString);
             const searchQuery=`${paths.termsList()}/?query=${searchString}`;
             const address = new URI(searchQuery);
            dispatchProps.goToAddress(address.href());
        },
        runDomainSearch: (domainName: String) => {
            const searchQuery=`${paths.termsList()}/?domain=${domainName}`;
            const address = new URI(searchQuery);
            dispatchProps.goToAddress(address.href());
        }
    }
}

const SearchOverviewForm = reduxForm({
    form: forms.startFilter,
    enableReinitialize: true,
})<any>(SearchOverview);

export default connect<ISearchOverviewStateProps, ISearchOverviewDispatchProps, ISearchOverviewOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SearchOverviewForm);