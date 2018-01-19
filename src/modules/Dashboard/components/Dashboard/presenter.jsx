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
import { LayoutManager } from 'modules/Dashboard/LayoutManager';
import isEmpty from 'lodash/isEmpty';
import Widget from './Widget';

import './style.scss';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.widgets = [
      {
        widget: <Widget key={'1'}>One</Widget>,
        defaultPosision: new LayoutManager.Position('1'),
      },
      {
        widget: <Widget key={'12'}>Two</Widget>,
        defaultPosision: new LayoutManager.Position('12', 2),
      },
      {
        widget: <Widget key={'13'}>Three</Widget>,
        defaultPosision: new LayoutManager.Position('13', 1, 2),
      },
      {
        widget: <Widget key={'14'}>Four</Widget>,
        defaultPosision: new LayoutManager.Position('14', 1, 1, 3),
      },
      {
        widget: <Widget key={'15'}>Five</Widget>,
        defaultPosision: new LayoutManager.Position('15', 1, 1, 4, 3),
      },
      {
        widget: <Widget key={'16'}>Six</Widget>,
        defaultPosision: new LayoutManager.Position('16'),
      },
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
      layout,
      updateLayout,
    } = props;
    const classes = BEMHelper('dashboard');
    let gridLayout = layout;
    if (isEmpty(gridLayout)) {
      gridLayout = this.widgets.map(widget => widget.defaultPosision);
    }

    return (
      <PageContent
        {...classes()}
        title={'Dashboard home'}
      >
        <div
          ref={(el) => {
            if (el && !gridWidth) {
              const box = el.getBoundingClientRect();
              const width = box.width - 126;
              setGridWidth(width);
            }
          }}
        >
          <ReactGridLayout
            {...classes('grid')}
            cols={4}
            rowHeight={300}
            width={gridWidth}
            layout={gridLayout}
            onDragStop={updateLayout}
            onResizeStop={updateLayout}
          >
            {this.getWidgets().map(widget => widget.widget)}
          </ReactGridLayout>
        </div>
        <LoadingPanel active={isLoading} />
      </PageContent>
    );
  }
}
