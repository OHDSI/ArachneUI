/*
 *
 * Copyright 2021 Odysseus Data Services, inc.
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
 * Authors: Alex Cumarav
 * Created: January 21, 2021
 *
 */

import * as d3 from 'd3';
import { get } from 'services/Utils';


export default (data, DTO = {
    "recordType": "RECORD_TYPE",
    "conceptId": "CONCEPT_ID",
    "conceptName": "CONCEPT_NAME",
    "duration": "DURATION",
    "countValue": "COUNT_VALUE",
    "pctPersons": "PCT_PERSONS",
}) => {

    const mappedData = get(data, DTO.conceptId, []).map((_val, index) => ({
        recordType: data[DTO.recordType][index],
        conceptId: data[DTO.conceptId][index],
        conceptName: data[DTO.conceptName][index],
        duration: data[DTO.duration][index],
        countValue: data[DTO.countValue][index],
        pctPersons: data[DTO.pctPersons][index],
    }));

    const scatterplotData = d3.nest()
        .key((line) => line.recordType)
        .entries(mappedData)
        .map((d) => ({
                name: d.key,
                values: d.values,
            })
        );

    return scatterplotData;
}