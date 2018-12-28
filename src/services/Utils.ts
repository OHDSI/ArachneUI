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

import * as numeral from 'numeral';
import keyMirror = require('keymirror');
import * as URI from 'urijs';
import * as moment from 'moment';

numeral.register('locale', 'arachne', {
  delimiters: {
    thousands: ' ',
    decimal: '.',
  },
  abbreviations: keyMirror({
    thousand: null,
    million: null,
    billion: null,
    trillion: null,
  }),
  ordinal: (num: number) => '',
  currency: {
    symbol: '',
  },
});

numeral.register('locale', 'arachne-short', {
  delimiters: {
    thousands: ' ',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'k',
    million: 'mil',
    billion: 'bn',
    trillion: 'tn',
  },
  ordinal: (num: number) => '',
  currency: {
    symbol: '',
  },
});

const numberFormatter = {
  format: (value: number, form: string = 'full') => {
    if (form === 'short') {
      numeral.locale('arachne-short');
    } else {
      numeral.locale('arachne');
    }
    return numeral(value).format('0[.]0 a');
  },
};

const isOuterLink = function(link) {
  const currentUri = new URI(window.location.href);
  const givenUri = new URI(link);
  return givenUri.domain().length !== 0 && currentUri.domain() !== givenUri.domain();
}

function diffInDays(fromDate: moment.Moment | number, toDate: moment.Moment | number) {
  const fd = moment(fromDate);
  const td = moment(toDate);

  return td.diff(fd, 'days');
}

export {
  numberFormatter,
  isOuterLink,
  diffInDays,
};
