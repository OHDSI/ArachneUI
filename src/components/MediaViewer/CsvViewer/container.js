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
 * Created: December 19, 2017
 *
 */

import { Component } from 'react';
import CSV from 'comma-separated-values';
import keyMirror from 'keymirror';
import presenter from './presenter';

class CsvViewer extends Component {
  constructor() {
    super();
    this.parseData = this.parseData.bind(this);
  }

  parseCsvTextData({ data }) {
    let isHeaderRead = false;
    const columns = [];
    const rows = [];

    if (data) {
      new CSV(data).forEach((array) => {
        if (!isHeaderRead) {
          isHeaderRead = true;
          array.forEach((cell, idx) => {
            columns.push({
              key: `key${idx}`,
              name: cell,
              resizable: true,
            });
          });
        } else {
          const row = {};
          array.forEach((cell, idx) => {
            row[`key${idx}`] = cell;
          });
          rows.push(row);
        }
      });
    }

    return {
      columns,
      rows,
    };
  }

  parseHeadersAndRecordsData({ headers, records }) {
    const columns = headers.map(h => ({ key: h, name: h, resizable: true }));
    return {
      columns,
      rows: records,
    };
  }

  parseData() {
    let columns = [];
    let rows = [];

    switch (this.props.dataType) {
      case CsvViewer.INPUT_DATA_TYPE.HEADER_AND_RECORDS:
        ({ columns, rows } = this.parseHeadersAndRecordsData({
          headers: this.props.headers,
          records: this.props.records,
        }));
        break;
      case CsvViewer.INPUT_DATA_TYPE.CSV_TEXT:
      default:
        ({ columns, rows } = this.parseCsvTextData({ data: this.props.data }));
        break;
    }

    return {
      columns,
      rows,
    };
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      ...this.parseData(),
    });
  }
}

CsvViewer.INPUT_DATA_TYPE = keyMirror({
  CSV_TEXT: null,
  HEADER_AND_RECORDS: null,
});

export default CsvViewer;
