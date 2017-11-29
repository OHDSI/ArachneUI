/*
 *  Copyright 2017 Observational Health Data Sciences and Informatics
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Company: Odysseus Data Services, Inc.
 *  Product Owner/Architecture: Gregory Klebanov
 *  Authors: Anton Gackovka
 *  Created: October 18, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, detectLanguageByExtension } from 'services/Utils';
import { isFat as isMimeTypeFat } from 'services/MimeTypeUtil';
import presenter from './presenter';

class FileViewer extends Component {

  componentWillMount() {
    const params = this.props;
    params.loadFile({
      ...params.urlParams,
      query : {...params.queryParams, withContent: false},
    }).then((result) => {
      if (!isMimeTypeFat(get(result, 'result.docType', '', 'String'))) {
        params.loadFile({
          ...params.urlParams,
          query : {...params.queryParams, withContent: true},
        });
      }
    });
  }

  render() {
    return presenter(this.props);
  }
}

FileViewer.propTypes = {
  file: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    docType: PropTypes.string,
    content: PropTypes.string,
    created: PropTypes.number,
  }),
  isLoading: PropTypes.boolean,
  loadFile: PropTypes.func,
  toolbarOpts: PropTypes.object,
  downloadLink: PropTypes.string,
  urlParams: PropTypes.object,
  pageTitle: PropTypes.string,
  queryParams: PropTypes.object,
};

function mapStateToProps(state, ownProps) {

  const file = get(ownProps, 'file', {});

  const title = get(file, 'label', '');
  const mimeType = get(file, 'docType');
  const createdAt = get(file, 'created');
  const language = detectLanguageByExtension(file);

  const isLoading = get(ownProps, 'isLoading');
  const content = isLoading ? null : get(file, 'content', null, 'String');

  const loadFile = get(ownProps, 'loadFile');

  return {
    content,
    mimeType,
    title,
    createdAt,
    language,
    loadFile,
  };
}

export default connect(mapStateToProps)(FileViewer);
