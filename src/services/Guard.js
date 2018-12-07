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
* Authors: Alexander Saltykov
* Created: December 03, 2018
*
*/

import isEqual from 'lodash/isEqual';
import keyMirror from 'keymirror';

export const guardStrategies = keyMirror({
  ALL: null,
  AT_LEAST_ONE: null,
});

export class Guard {
  constructor({
    rules = [],
    grantedPermissions = [],
    tooltip,
    strategy = guardStrategies.AT_LEAST_ONE,
  }) {
    this.strategy = strategy;
    this.rules = rules;
    const permissions = Object.entries(grantedPermissions);
    this.grantedPermissions = permissions
      .filter(([perm, isGranted]) => isGranted)
      .map(([perm, isGranted]) => perm);
    const unmetPermissions = permissions.length === 0
      ? rules // if no permissions passed at all, every rule is unmet
      : permissions
        .filter(([perm, isGranted]) => rules.includes(perm) && !isGranted)
        .map(([perm, isGranted]) => perm);
    
    this.tooltip = `You should meet ${strategy === guardStrategies.ALL ? 'ALL' : 'AT LEAST ONE'} of the rules: 
    ${unmetPermissions
      .map((perm, index) => `${index + 1}. ${tooltip[perm] || perm}`)
      .join('; ')
    }`;
  }

  isEqual(another) {
    if (!(another instanceof Guard)) {
      return false;
    }
    return isEqual(another.rules, this.rules) &&
      isEqual(another.grantedPermissions, this.grantedPermissions);
  }

  isMet() {
    const metPermissions = this.grantedPermissions.find(
      permission => this.rules.includes(permission)
    );

    if (metPermissions === undefined) {
      return false;
    }

    return this.strategy === guardStrategies.ALL
      ? metPermissions.length === this.rules.length
      : metPermissions.length > 0;
  }
}
