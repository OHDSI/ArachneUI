/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: August 30, 2017
 *
 */

// @ts-check
import React, { PropTypes, Component } from 'react';
import {
  TableCellStatus as Status,
} from 'arachne-ui-components';
import { paths } from 'modules/StudyManager/const';
import BEMHelper from 'services/BemHelper';
import Card from 'components/Card';
import moment from 'moment';
import { usDateOnly } from 'const/formats';
import TitleStudy from 'components/TitleStudy';

import './style.scss';

/** @augments { Component<any, any> } */
class StudyCard extends Component {
  static get propTypes() {
    return {
      id: PropTypes.number,
      title: PropTypes.string,
      leadList: PropTypes.array,
      role: PropTypes.string,
      created: PropTypes.number,
      updated: PropTypes.number,
      type: PropTypes.object,
      status: PropTypes.object,
      favourite: PropTypes.bool,
    
      timestampFormatter: PropTypes.func,
      typeFormatter: PropTypes.func,
      statusFormatter: PropTypes.func,
      userLinkFormatter: PropTypes.func,
      setFavourite: PropTypes.func,
      getTitleStudyProps: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.classes = BEMHelper('study-card');
  }

  getTitleStudyProps() {
    return {
      ...this.classes('title'),
      mods: ['large', 'nowrap'],
      title: this.props.title,
      link: paths.studies(this.props.id),
      isFavourite: this.props.favourite,
      toggleFavorite: () => this.props.setFavourite(
        this.props.id,
        (!this.props.favourite).toString()
      ),
    };
  }

  render() {
    const {
      leadList,
      role,
      created,
      endDate,
      type,
      status,

      timestampFormatter,
      typeFormatter,
      statusFormatter,
    } = this.props;

    const titleEl = (
      <TitleStudy
        {...this.getTitleStudyProps()}
      />
    );

    const dates = (
      <div {...this.classes('dates')}>
        <span {...this.classes('ico')}>date_range</span>
        {moment(created).format(usDateOnly)}
        <span {...this.classes('ico', 'reversed')}>keyboard_backspace</span>
        {endDate ? moment(endDate).format(usDateOnly) : 'Empty end date'}
      </div>
    );

    return (
      <Card
        title={titleEl}
        status={<Status {...this.classes('status')} value={statusFormatter(status)} />}
        date={<span>Created {timestampFormatter(created)}</span>}
        userList={leadList.map(user => ({
          id: user.id,
          name: `${user.firstname} ${user.lastname}`,
        }))}
        footerExtra={dates}
      >
        <div className="row">
          <div className="col-xs-6">
            <div {...this.classes('line')}>
              <span {...this.classes('attribute-name')}>Role</span>: {role}
            </div>
            <div {...this.classes('line')}>
              <span {...this.classes('attribute-name')}>Type</span>: {typeFormatter(type)}
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default StudyCard;
