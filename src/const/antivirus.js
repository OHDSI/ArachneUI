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
 * Created: January 26, 2018
 *
 */
import keyMirror from 'keymirror';

export const scanStatuses = keyMirror({
  WILL_NOT_SCAN: null,
  NOT_SCANNED: null,
  SCANNING: null,
  OK: null,
  INFECTED: null,
});

const messages = {
  WILL_NOT_SCAN: 'File will not be scanned with anti-virus',
  NOT_SCANNED: 'File was not scanned with anti-virus',
  SCANNING: 'Scanning is in progress',
  OK: 'File was scanned',
  INFECTED: 'File is infected',
};

export function isScanned(status) {
  return [
    scanStatuses.WILL_NOT_SCAN,
    scanStatuses.OK,
  ].includes(status);
}

export const icon = '/img/icons/documents/antivirus.svg';

export function getScanResultDescription(status, message) {
  if (!message) {
    return messages[status];
  }

  return message;
}
