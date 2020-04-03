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
import { connect } from 'react-redux';
import presenter, {
    IDownloadDispatchProps,
    IDownloadsOwnProps,
    IDownloadsProps,
    IDownloadStateProps
} from "./presenter";
import selectors, { DownloadRecord, getSorting } from '../selectors';
import actions from "modules/Admin/actions";
import { SortingParams } from "modules/Admin/actions/statistics";

class Downloads extends Component<IDownloadsProps, {}> {

    constructor() {
        super();
        this.setSorting = this.setSorting.bind(this);
    }

    render() {
        return presenter({
            ...this.props,
            setSorting: this.setSorting
        });
    }

    setSorting(sorting: SortingParams) {

        this.props.updateStatisticsSorting(sorting);
        this.props.runSearch();
    }
}

function mapStateToProps(state: Object, ownProps: IDownloadsOwnProps): IDownloadStateProps {
    let recordsRaw = selectors.getDownloadHistoryRecords(state);
    const records = recordsRaw as DownloadRecord[];
    const sorting = getSorting(state);
    return {
        records,
        sorting,
    };
}


function mergeProps(stateProps: IDownloadStateProps, dispatchProps: IDownloadDispatchProps, ownProps: IDownloadsOwnProps) {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
    }
}

const mapDispatchToProps = {
    updateStatisticsSorting: actions.statistics.updateStatisticsSorting,
};


export default connect<IDownloadStateProps, IDownloadDispatchProps, IDownloadsOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Downloads);

