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
 * Created: April 28, 2017
 *
 */

import URI from 'urijs';
import { paths } from 'modules/Auth/const';

// Collecting all paths related to Auth module
// and checking if passed one is in list
function isAuthModulePath(pathname) {
  return Object
        .values(paths)
        .map((path) => {
          const uri = new URI(path());
          return uri.pathname();
        })
        .includes(pathname);
}

function leaveIfAuthed(props) {
  if (props.isUserAuthed) {
    props.goToRoot();
  }
}

export default {
  isAuthModulePath,
};
export {
  isAuthModulePath,
  leaveIfAuthed,
};
