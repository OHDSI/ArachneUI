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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import { get, detectMimeTypeByExtension } from 'services/Utils';
import { paths } from 'modules/AnalysisExecution/const';
import fileConverter from 'components/FileInfo/converter';
import MimeTypes from 'const/mimeTypes';

export default class SelectorsBuilder {
  getSelectableMimeTypes() {
    return [
      MimeTypes.r,
      MimeTypes.sql,
      MimeTypes.cohort,
      MimeTypes.cohortdefinitionjson,
    ];
  }

  getAnalysis(state) {
    return get(
      state,
      'analysisExecution.analysis.data.result',
      {
        id: -1,
        docType: 'unknown',
        type: { id: -1 },
      },
      'Object'
    );
  }

  getRawCodeList(state) {
    return get(state, 'analysisExecution.analysis.data.result.files') || [];
  }
  getLoggedUserId(state) {
    return get(state, 'auth.principal.queryResult.result.id', -1);
  }

  getCode(analysis, code) {
    const converted = fileConverter(
      code,
      codeFile => paths.analysisCode({
        analysisId: analysis.id,
        codeFileId: codeFile.uuid,
      })
    );
    converted.removable = get(code, 'permissions.DELETE_ANALYSIS_FILES', false);
    
    const mimeType = detectMimeTypeByExtension(code);
    converted.selectable = this.getSelectableMimeTypes().includes(mimeType);
    return converted;
  }

  createSelectorForCodeList() {
    return createSelector(
      [this.getAnalysis, this.getRawCodeList],
      (analysis, codeList) => codeList.map(this.getCode.bind(this, analysis)),
    );
  }

  getIsLoading(state) {
    return get(
      state,
      'analysisExecution.importEntity.isUpdating',
      false,
      'Boolean'
    );
  }

  build() {
    return {
      getCodeList: this.createSelectorForCodeList(),
      getIsLoading: this.getIsLoading,
    };
  }
}
