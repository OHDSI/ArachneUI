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
 * Created: May 11, 2017
 *
 */

import { detectMimeTypeByExtension, Utils } from 'services/Utils';

const profilePath = id => `/expert-finder/profile/${id}`;

function getLink(file, pathBuilder) {
  let link = null;

  if (file.link) {
    link = file.link;
  } else if (typeof pathBuilder === 'function') {
    link = pathBuilder(file);
  }

  return Utils.getSecureLink(link);
}

export default (file, pathBuilder) => ({
  fileId: file.fileId,
  uuid: file.uuid,
  name: file.name,
  label: file.label,
  createdAt: file.created,
  // doctype: file.docType === 'text/x-r-source' ? 'r' : file.docType,
  docType: detectMimeTypeByExtension(file),
  isExecutable: file.isExecutable,
  ...getLink(file, pathBuilder),
  author: {
    ...file.author,
    link: (file.author && file.author.id) ? profilePath(file.author.id) : null,
  },
  commentTopicId: file.commentTopicId,
  version: file.version,
  isImported: file.imported,
  manuallyUploaded: file.manuallyUploaded,
  antivirusStatus: file.antivirusStatus,
  antivirusDescription: file.antivirusDescription,
});