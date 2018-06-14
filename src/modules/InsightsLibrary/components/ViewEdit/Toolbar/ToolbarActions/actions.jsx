/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: September 13, 2017
 *
 */

// @ts-check
import React from 'react';
import {
  Button,
} from 'arachne-ui-components';

export default class ActionsBuilder {
  constructor(props, bemHelper) {
    this.selectedPublishState = props.selectedPublishState;
    this.openSettings = props.openSettings;
    this.permissions = props.permissions;
    this.remove = props.remove;
    this.bemHelper = bemHelper;
  }

  build() {
    const actions = [];
    if (this.permissions.EDIT_PAPER) {
      actions.push(<li
        {...this.bemHelper({ element: 'action', extra: 'ac-tooltip' })}
        aria-label={'Manage settings'}
        data-tootik-conf="left"
      >
        <Button
          {...this.bemHelper('btn')}
          onClick={this.openSettings}
        >
          <span {...this.bemHelper('btn-ico')}>settings</span>
        </Button>
      </li>);
      actions.push(<li
        {...this.bemHelper({ element: 'action', extra: 'ac-tooltip' })}
        aria-label="Delete insight"
        data-tootik-conf="left"
      >
        <Button {...this.bemHelper('btn')} onClick={this.remove}>
          <i {...this.bemHelper('btn-ico')}>delete</i>
        </Button>
      </li>);
    } else {
      actions.push(
        <span
          {...this.bemHelper({ element: 'label', extra: 'ac-tooltip' })}
          aria-label={this.selectedPublishState.tooltip}
          data-tootik-conf="left"
        >
          Status: {this.selectedPublishState.label}
        </span>
      );
    }

    return actions;
  }
}
