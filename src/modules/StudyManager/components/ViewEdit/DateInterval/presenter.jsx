/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: December 27, 2016
 *
 */

import React, { Component, PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import DatePanel from 'components/DatePanel';
import moment from 'moment';

require('./style.scss');

function DateInterval({ startDate, endDate, setStartDate, setEndDate, isEditable }) {
  const classes = new BEMHelper('study-date-interval');
  const dateFormat = 'MM/DD/YYYY';

  return (
    <div id="study-dates" {...classes({ extra: 'row' })}>
      <div className="col-xs-12 col-sm-6">
        <DatePanel
          title={'Start date'}
          selected={startDate}
          maxDate={moment(endDate).add(-1, 'days')}
          dateFormat={dateFormat}
          isEditable={isEditable}
          onChange={setStartDate}
        />
      </div>
      <div className="col-xs-12 col-sm-6">
        <DatePanel
          title={'End date'}
          selected={endDate}
          minDate={moment(startDate).add(1, 'days')}
          dateFormat={dateFormat}
          isEditable={isEditable}
          onChange={setEndDate}
        />
      </div>
    </div>
  );
}

DateInterval.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  endDate: PropTypes.any,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  startDate: PropTypes.any,
};

export default DateInterval;
