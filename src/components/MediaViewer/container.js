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
 * Created: August 11, 2017
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'services/Utils';
import presenter from './presenter';

class MediaViewer extends Component {
  constructor() {
    super();
    this.state = {
      container: null,
      totalPages: null,
    };
    this.setContainer = this.setContainer.bind(this);
    this.onPDFLoaded = this.onPDFLoaded.bind(this);
    this.onPageLoad = this.onPageLoad.bind(this);
  }

  onPDFLoaded({ total }) {
    this.setState({
      totalPages: total,
    });
  }

  onPageLoad({ pageIndex, pageNumber }) {
  }
  
  setContainer(container) {
    this.setState({
      container,
    });
  }
  render() {
    return presenter({
      ...this.props,
      ...this.state,
      setContainer: this.setContainer,
      onPDFLoaded: this.onPDFLoaded,
      onPageLoad: this.onPageLoad,
    });
  }
}

function mapStateToProps(state, ownProps) {
  const path = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    search: '',
  });
  const downloadLink = ownProps.downloadLink;
  return {
    path: path.pathname + path.search,
    pageIndex: parseInt(get(path, 'query.page', 1), 10),
    downloadLink,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaViewer);
