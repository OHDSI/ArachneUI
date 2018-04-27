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
 * Created: July 10, 2017
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { introJs } from 'intro.js';
import presenter from './presenter';
import selectors from './selectors';

const guide = introJs();

class Checklist extends Component {

  constructor(props) {
    super(props);
    this.startGuide = this.startGuide.bind(this);
    this.showGuideStep = this.showGuideStep.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  startGuide() { // eslint-disable-line class-methods-use-this
    guide.start();
  }

  showGuideStep(step) { // eslint-disable-line class-methods-use-this
    guide.goToStepNumber(step).start();
  }

  closeDropdown() {
    // eslint-disable-next-line
    this.refs.dropdown.hide();
  }

  render() {
    return presenter({
      ...this.props,
      startGuide: this.startGuide,
      showGuideStep: this.showGuideStep,
      closeDropdown: this.closeDropdown,
    });
  }
}

function mapStateToProps(state) {
  const stepList = selectors.getStepList(state);

  guide.setOptions({
    steps: stepList.map(s => ({
      element: s.element,
      position: s.position,
      intro: s.title,
    })),
    hidePrev: true,
    hideNext: true,
  });

  return {
    percent: Math.floor((stepList.filter(s => s.isDone).length / stepList.length) * 100),
    stepList,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Checklist);
