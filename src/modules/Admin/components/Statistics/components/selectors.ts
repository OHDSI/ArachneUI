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


import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as moment from "moment";
import { commonDateFormat } from "../../../../../const/formats";

interface DownloadRecord {
    vocabularyName: string,
    code: string,
    userName: string,
    organization: string,
    date: string,

}

const getRawDownloadRecord = (state: Object) => get(state, 'admin.statistics.queryResult') || [];

const getDownloadHistoryRecords = createSelector(
    getRawDownloadRecord,
    (rawResults: [DownloadRecord]) => rawResults.map((downloadRecord: DownloadRecord, index: number) => ({
        ...downloadRecord,
        // for redux-form
        index,
    })),
);

const prevQuarter = moment().quarter(moment().quarter() - 1).startOf('quarter');
const getSorting = (state) => get(state, 'admin.statisticsSorting.data.sorting', {sortAsc: true, sortBy: 'code'});
const getStatisticFilter = (state) => get(state, 'form.downloadsFilter.values', {
    from: prevQuarter,
    to: moment(),
    licensedOnly: false,
    keywords: ''
});
const getStatisticFilterForQuery = (state) => {
    let filter = getStatisticFilter(state);
    return {
        ...filter,
        from: filter.from.format(commonDateFormat),
        to: filter.to.format(commonDateFormat),
    };
};

export default {getDownloadHistoryRecords};

export {
    DownloadRecord,
    getSorting,
    getStatisticFilter,
    getStatisticFilterForQuery
}