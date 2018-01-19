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
 * Created: April 24, 2017
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  LoadingPanel,
  PageContent,
} from 'arachne-ui-components';
import EmptyState from 'components/EmptyState';
import ReactGridLayout from 'react-grid-layout';
import Widget from './Widget';

import './style.scss';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.widgets = [
      <Widget key={'1'}>One</Widget>,
      <Widget key={'12'}>Two</Widget>,
      <Widget key={'13'}>Three</Widget>,
      <Widget key={'14'}>Four</Widget>,
      <Widget key={'15'}>Five</Widget>,
      <Widget key={'16'}>Six</Widget>,
    ];
  }

  getWidgets() {
    return this.widgets;
  }

  render(props) {
    const {
      isLoading,
      gridWidth,
      setGridWidth,
    } = props;
    const classes = BEMHelper('dashboard');
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ];

    return (
      <PageContent
        {...classes()}
        title={'Dashboard home'}
      >
        <div
          ref={(el) => {
            if (el && !gridWidth) {
              const box = el.getBoundingClientRect();
              const width = box.width;
              setGridWidth(width);
            }
          }}
        >
          <ReactGridLayout
            {...classes('grid')}
            cols={4}
            rowHeight={300}
            width={gridWidth}
          >
            {this.getWidgets()}
          </ReactGridLayout>
        </div>
        <LoadingPanel active={isLoading} />
      </PageContent>
    );
  }
}
