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
 * Created: December 27, 2016
 *
 */

import React, { Component, PropTypes } from 'react';
import DraggableList from 'react-draggable-list';
import { Panel } from 'arachne-components';
import { ListItem } from 'arachne-components';
import { Link } from 'arachne-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

// NOTE:
// Class is required due to DraggableList which uses refs
class AnalysesItem extends Component {
  render() {
    const {
      id,
      isEditable,
      isRemovable,
      title,
      link,
      removeAnalysis,
    } = this.props.item;

    const mods = {
      hover: true,
      draggable: isEditable,
      removable: isEditable && isRemovable,
    };

    return (
      <ListItem {...this.props} mods={mods} onRemove={() => removeAnalysis(id)}>
        <Link to={link}>{title}</Link>
      </ListItem>
    );
  }
}

AnalysesItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
    isRemovable: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    removeAnalysis: PropTypes.func.isRequired,
  }),
};

function ListAnalyses(props) {
  const classes = new BEMHelper('study-analyses-list');
  const {
    isEditable,
    moveAnalysis,
    openCreateAnalysisModal,
    removeAnalysis,
  } = props;
  let {
    analysisList,
  } = props;

  analysisList = analysisList.map(item => ({
    ...item,
    isEditable,
    removeAnalysis,
  }));

  return (
    <Panel
      {...classes()}
      id="study-analyses"
      title="Analyses"
    >
      <DraggableList
        itemKey="id"
        template={AnalysesItem}
        list={analysisList}
        container={() => document.body}
        padding={0}
        onMoveEnd={moveAnalysis}
        unsetZIndex
      />
      {analysisList.length === 0 &&
        <ListItem label="No analyses" />
      }
      {isEditable &&
        <ListItem mods="add" label="Add analysis" onClick={openCreateAnalysisModal} />
      }
    </Panel>
  );
}

ListAnalyses.propTypes = {
  analysisList: PropTypes.array.isRequired,
  isEditable: PropTypes.bool.isRequired,
  moveAnalysis: PropTypes.func.isRequired,
  openCreateAnalysisModal: PropTypes.func.isRequired,
  removeAnalysis: PropTypes.func.isRequired,
};

export default ListAnalyses;
