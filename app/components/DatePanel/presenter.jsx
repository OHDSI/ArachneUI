/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: July 25, 2017
 *
 */

import React, { Component, PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Datepicker } from 'arachne-components';
import moment from 'moment';

require('./style.scss');

// NOTE: Datepicker requires DateInput to be a class
/**
 * @param {any} options.className
 * @param {string} options.value        Value passed by datepicker.
 * @param {string} options.displayValue Value passed by parent component.
 * @param {function} options.onClick    Function that should be called to open datepicker.
 */
class DateInput extends Component {
  render() {
    const classes = new BEMHelper('study-date-input');
    const materialClasses = new BEMHelper('material-icons');
    const {
      className,
      displayValue,
      onClick,
    } = this.props;

    // NOTE:
    // We should be able to render custom caption (e.g., 'Empty'),
    // that's why we cannot use value passed by datepicker which is always a date
    return (
      <span {...classes({ extra: className })} onClick={onClick}>
        <span {...classes('ico')}>
          <i {...materialClasses()}>date_range</i>
        </span>
        <span {...classes('value')}>
          {displayValue}
        </span>
      </span>
    );
  }
}

DateInput.propTypes = {
  className: PropTypes.any,
  displayValue: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

function DatePanel({
  title,
  selected,
  dateFormat,
  minDate,
  maxDate,
  isEditable,
  onChange,
  className,
}) {
  const classes = new BEMHelper('study-date-panel');
  const displayDate = selected ? moment(selected).format(dateFormat) : 'Empty';

  return (
    <div {...classes({ extra: className })}>
      <span {...classes('title')}>
        {title}
      </span>
      {isEditable ?
        <Datepicker
          {...classes('picker')}
          selected={selected || moment()}
          customInput={<DateInput displayValue={displayDate} />}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
        />
        :
        <DateInput displayValue={displayDate} />
      }
    </div>
  );
}

DatePanel.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.any,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DatePanel;
