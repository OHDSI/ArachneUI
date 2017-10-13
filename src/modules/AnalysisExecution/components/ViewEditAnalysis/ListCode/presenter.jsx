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

// @ts-check
import React, { Component } from 'react';
import {
  Button,
  LoadingPanel,
  ListItem,
  Panel,
} from 'arachne-ui-components';
import FileInfo from 'components/FileInfo';
import BEMHelper from 'services/BemHelper';

import './style.scss';

/** @augments{ Component<any, any>} */
export class CodeItem extends Component {
  constructor() {
    super();
    this.classes = BEMHelper('analysis-code-item');
  }

  getFileDescription() {}

  getWrapperClassName() {
    return this.classes();
  }

  getComponent() {
    return [
      <div {...this.classes('main-info')}>
        <FileInfo {...this.code} subtitle={this.getFileDescription()} />
      </div>
    ];
  }

  render() {
    this.code = this.props.code;
    this.isEditable = this.props.isEditable;
    this.reimportCode = this.props.reimportCode;
    this.removeCode = this.props.removeCode;
    this.toggleExecutable = this.props.toggleExecutable;
    this.removable = this.props.removable;
    this.selectExecutable = this.props.selectExecutable;

    const mods = {
      hover: true,
      actionable: this.isEditable,
    };

    const actions = [];

    if (this.isEditable && this.code.isImported === true) {
      actions.push(
        <span
          {...this.classes('action')}
          onClick={() => this.reimportCode(this.code.uuid)}
        >
          <i {...this.classes('action-ico', 'reimport')}>
            cached
          </i>
        </span>
      );
    }

    if (this.removable) {
      actions.push(
        <span
          {...this.classes('action')}
          onClick={() => this.removeCode(this.code.uuid)}
        >
          <i {...this.classes('action-ico', 'remove')}>
            close
          </i>
        </span>
      );
    }


    return (
      <ListItem
        {...this.getWrapperClassName()}
        mods={mods}
        actions={actions}
      >
        <div {...this.classes('content')}>
          {this.getComponent()}
        </div>
      </ListItem>
    );
  }
}

/** @augments{ Component<any, any>} */
export class ActionsLine extends Component {
  constructor() {
    super();
    this.classes = BEMHelper('analysis-code-actions');
    this.addClasses = BEMHelper('analysis-add-code');
    this.submitClasses = BEMHelper('analysis-submit-code');
    this.tooltipClass = BEMHelper('tooltip');
  }

  getComponents() {
    const submit = (
      <Button
        {...this.submitClasses()}
        mods={['success']}
        label="Submit"
        onClick={this.openSubmitModal} />
    );
    const add = (
      <Button
        {...this.addClasses({ modifiers: { disabled: !this.canAddFiles } })}
        onClick={this.openCreateCodeModal}
        disabled={!this.canAddFiles}
      >
        <span {...this.addClasses('content')}>
          <i {...this.addClasses('ico')}>
            add_circle_outline
          </i>
          <span {...this.addClasses('label')}>
            Add code file
          </span>
        </span>
      </Button>
    );

    return {
      add,
      submit,
    };
  }

  render() {
    this.openCreateCodeModal = this.props.openCreateCodeModal;
    this.openSubmitModal = this.props.openSubmitModal;
    this.canAddFiles = this.props.canAddFiles;

    return (
      <li {...this.classes()}>
        {Object.values(this.getComponents())}
      </li>
    );
  }
}

export function DownloadAll({ downloadAllLink }) {
  const classes = BEMHelper('analysis-code-list-download-all');

  return (
    <Button
      {...classes()}
      link={downloadAllLink}
      target="_self"
    >
      file_download
    </Button>
  );
}

/** @augments{ Component<any, any>} */
export default class ListCode extends Component {
  constructor() {
    super();
    this.classes = BEMHelper('analysis-code-list');
  }

  getCodeItems() {
    return this.codeList.map((code, key) =>
      <CodeItem
        code={code}
        isEditable={!this.isLocked}
        reimportCode={this.reimportCode}
        removeCode={this.removeCode}
        key={key}
        removable={this.canDeleteFiles || code.removable}
      />
    );
  }

  getActions() {
    return (<ActionsLine
      canAddFiles={!this.isLocked}
      openCreateCodeModal={this.openCreateCodeModal}
      openSubmitModal={this.openSubmitModal}
    />);
  }

  render() {
    this.codeList = this.props.codeList;
    this.downloadAllLink = this.props.downloadAllLink;
    this.isSubmittable = this.props.isSubmittable;
    this.isLoading = this.props.isLoading;
    this.openCreateCodeModal = this.props.openCreateCodeModal;
    this.openSubmitModal = this.props.openSubmitModal;
    this.reimportCode = this.props.reimportCode;
    this.removeCode = this.props.removeCode;
    this.isLocked = this.props.isLocked;
    this.canDeleteFiles = this.props.canDeleteFiles;

    return (
      <Panel
        {...this.classes()}
        title="Code files"
        headerBtns={() => this.codeList.length !== 0
          ? DownloadAll({ downloadAllLink: this.downloadAllLink })
          : null
        }
      >
        <ul {...this.classes('list')}>
          {this.getCodeItems()}
          {this.codeList.length === 0 &&
            <ListItem label={'No code files available'}/>
          }
          {this.isSubmittable &&
            this.getActions()
          }
        </ul>
        {this.isLoading &&
          <LoadingPanel active={this.isLoading} />
        }
      </Panel>
    );
  }
}
