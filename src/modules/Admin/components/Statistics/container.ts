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
 * Created: April 02, 2020
 *
 */


import { Component } from "react";
import actions from 'modules/Admin/actions';
import { connect } from "react-redux";
import * as URI from 'urijs';
import presenter, { IStatisticsDispatchProps, IStatisticsProps, IStatisticsStateProps } from "./presenter";
import { getSorting, getStatisticFilterForQuery } from './components/selectors';
import { SortingParams } from "modules/Admin/actions/statistics";
import { apiPaths } from 'modules/Admin/const';

class Statistics extends Component<IStatisticsProps, {}> {

    constructor() {
        super();
        this.runSearch = this.runSearch.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
    }

    componentDidMount(): void {
        this.runSearch(null);
    }

    runSearch(sorting?: SortingParams) {
        const query = {
            ...this.props.filter,
            ...this.props.sorting,
            ...sorting,
        };
        this.props.loadStatistics(query);
    }

    downloadCSV() {
        const csvDownloadLink = new URI();
        csvDownloadLink.setSearch(Object.assign({}, this.props.filter, this.props.sorting));
        const downloadCsvLink = apiPaths.statisticsCsv(csvDownloadLink.search());
        window.open(downloadCsvLink, '_blank');
    }

    render() {
        return presenter({
            ...this.props,
            runSearch: this.runSearch,
            downloadCSV: this.downloadCSV
        });
    }
}

const mapDispatchToProps = {
    loadStatistics: actions.statistics.loadStatistics,
};

function mapStateToProps(state: Object): IStatisticsStateProps {
    const filter = getStatisticFilterForQuery(state);
    const sorting = getSorting(state);
    return {sorting, filter};
}

export default connect<IStatisticsStateProps, IStatisticsDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
    null
)(Statistics);
