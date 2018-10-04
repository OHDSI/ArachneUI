import { LICENSE_AGREEMENT_KEY, actionTypes, acceptanceExpiresInDays } from "../const";
import * as moment from "moment";
import { diffInDays } from "services/Utils";

/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: October 3, 2018
 *
 */

function getIsAccepted() {
  const acceptanceDate = localStorage.getItem(LICENSE_AGREEMENT_KEY);
  let isAccepted = false;

  if (acceptanceDate !== null) {
    const isExpired = diffInDays(parseInt(acceptanceDate, 10), moment().add(acceptanceExpiresInDays, 'days')) <= 0;
    isAccepted = !isExpired;
  }

  return {
    type: actionTypes.LICENSE_AGREEMENT_GET,
    payload: {
      isAccepted,
    },
  };
}

function setIsAccepted(isAccepted: boolean) {
  localStorage.setItem(LICENSE_AGREEMENT_KEY, Date.now().toString());
  return {
    type: actionTypes.LICENSE_AGREEMENT_SET,
    payload: {
      isAccepted,
    },
  };
}

export default {
  setIsAccepted,
  getIsAccepted,
};
