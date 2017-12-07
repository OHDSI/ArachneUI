/*
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
 * Created: September 21, 2017
 *
 */

import 'es6-promise/auto';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';
import 'core-js/fn/array/includes';
import 'core-js/fn/array/find';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/symbol';

import fonts from './fonts';

function getBinary(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file, false);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.send(null);
  return xhr.responseText;
}

// Base64 encode binary string
// Stolen from http://stackoverflow.com/questions/7370943/retrieving-binary-file-content-using-javascript-base64-encode-it-and-reverse-de
function base64Encode(str) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const len = str.length;
  let out = '';
  let i = 0;
  let c1;
  let c2;
  let c3;
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i === len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i === len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt((c2 & 0xF) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += CHARS.charAt(c1 >> 2);
    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += CHARS.charAt(c3 & 0x3F);
  }
  return out;
}

function loadFontAsBase64(font) {
  const url = font.src;
  const fontFamily = font['font-family'];
  const fontStyle = font['font-style'];
  const fontWeight = font['font-weight'];

  const base64EncodedFont = base64Encode(getBinary(url));

  const fontCode = `@font-face {
    font-family: '${fontFamily}';
    src: url('data:application/font-woff;base64,${base64EncodedFont}') format('woff');
    font-style: ${fontStyle};
    font-weight: ${fontWeight}
  }`;
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = fontCode;
  } else {
    styleElement.innerHTML = fontCode;
  }
  document.head.appendChild(styleElement);
}

if (typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string') {

  // Microsoft are idiots as usual and fetch from their Edge v40 is not working,
  // so we need to force polyfill in such case
  const isEdge = /Edge\//.test(navigator.userAgent);
  if (isEdge) {
    window.fetch = undefined; // ensure the polyfill runs
  }

  const isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
  // if (isIE) {
    fonts.forEach(loadFontAsBase64);
  // }
}

require('whatwg-fetch');
