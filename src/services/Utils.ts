import * as numeral from 'numeral';
import keyMirror = require('keymirror');

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

export {
  numberFormatter,
};
