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


import * as React from 'react';
import BEMHelper from "services/BemHelper";

import { Table, TableCellText as Cell, } from 'arachne-ui-components';

import { DownloadRecord } from "../selectors";
import { SortingParams } from "modules/Admin/actions/statistics";

require('./style.scss');

interface IDownloadsProps extends IDownloadStateProps, IDownloadDispatchProps, IDownloadsOwnProps {

    setSorting: (SortingParams) => void;
}

interface IDownloadsOwnProps {
    runSearch: Function;
}

interface IDownloadStateProps {
    records: DownloadRecord[];
    sorting: SortingParams;
}

interface IDownloadDispatchProps {
    updateStatisticsSorting: (SortingParams) => void;
}


function DownloadsHistoryTable(props) {
    const classes = BEMHelper('downloads-history-table');
    const {records} = props;
    return (
        <Table
            {...classes('table')}
            data={records}
            mods={['hover']}
            sorting={props.sorting}
            setSorting={props.setSorting}
        >

            <Cell
                {...classes('code')}
                header='CODE'
                field='code'
            />
            <Cell
                {...classes('class')}
                header='NAME'
                field='vocabularyName'
            />

            <Cell
                {...classes('concept')}
                header='DATE'
                field='date'
            />
            <Cell
                {...classes('invalid')}
                header='USER'
                field='userName'
            />
            <Cell
                {...classes('domain')}
                header='ORGANIZATION'
                field='organization'
            />
        </Table>
    );
}


function Downloads(props: IDownloadsProps) {

    const classes = BEMHelper('downloads');

    return (
        <div {...classes()}>
            <div>
                <DownloadsHistoryTable {...props} />
            </div>
        </div>);
}

export { IDownloadsProps, IDownloadStateProps, IDownloadDispatchProps, IDownloadsOwnProps }
export default Downloads;