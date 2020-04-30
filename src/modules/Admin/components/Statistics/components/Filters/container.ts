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
 * Created: March 30, 2020
 *
 */


import { Component } from "react";
import presenter, {
    IStatisticsFilter,
    IStatisticsFilterDispatchProps,
    IStatisticsFilterOwnProps,
    IStatisticsFilterProps,
    IStatisticsFilterStateProps
} from "./presenter";
import { get } from "lodash";
import * as moment from "moment";
import actions from 'modules/Admin/actions';
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { forms } from 'modules/Admin/const';
import { getStatisticFilter } from '../selectors';

class Filters extends Component<IStatisticsFilterProps, {}> {

    render() {
        return presenter(this.props);
    }
}

const mapDispatchToProps = {
    loadStatistics: actions.statistics.loadStatistics,
};

function mapStateToProps(state: Object): IStatisticsFilterStateProps {
    const isLoading = get(state, 'services.statistics.isLoading', false);
    const filter = getStatisticFilter(state);

    return {
        isLoading,
        filter: filter
    };
}

function formSubmitHandler(values: IStatisticsFilter, dispatch, props: IStatisticsFilterProps) {
    props.runSearch();
}

function mergeProps(stateProps: IStatisticsFilterStateProps, dispatchProps: IStatisticsFilterDispatchProps, ownProps: IStatisticsFilterOwnProps) {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
    }
}

const prevQuarter = moment().quarter(moment().quarter() - 1).startOf('quarter');
const FormFilters = reduxForm({
    form: forms.downloadsFilter,
    onSubmit: formSubmitHandler,
    initialValues: {...getStatisticFilter({}), from: prevQuarter},
})<any>(Filters);


export default connect<IStatisticsFilterStateProps, IStatisticsFilterDispatchProps, IStatisticsFilterOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(FormFilters);