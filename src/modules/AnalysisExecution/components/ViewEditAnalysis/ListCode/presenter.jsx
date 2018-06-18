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
import { submissionFileUploadModes } from 'modules/AnalysisExecution/components/ViewEditAnalysis/ModalCreateCode/presenter';

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
    this.isLocked = this.props.isLocked;
    this.canBeReimported = this.props.canBeReimported;
    
    const mods = {
      hover: true,
      actionable: true,
    };

    const actions = [];

    if (this.canBeReimported && this.code.isImported === true) {
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

    if (!this.isLocked && this.removable) {
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

  getComponents(useMarginForLastComponent = true) {
    const submit = (
      <Button
        {...this.submitClasses({ modifiers: { autoMargin: useMarginForLastComponent} })}
        mods={['success', 'rounded']}
        label="Submit"
        onClick={this.openSubmitModal}
        disabled={!this.props.canSubmit}
      />
    );
    const add = (
      <Button
        {...this.addClasses({ modifiers: { disabled: !this.canAddFiles } })}
        onClick={() => this.openCreateCodeModal(submissionFileUploadModes.COMPUTER)}
        disabled={!this.canAddFiles}
      >
        <span {...this.addClasses('ico', 'upload')}>file_upload</span>
        <span {...this.addClasses('label')}>Upload</span>
      </Button>
    );
    const importFromAchilles = (
      <Button
        {...this.addClasses({ modifiers: { disabled: !this.canAddFiles } })}
        onClick={() => this.openCreateCodeModal(submissionFileUploadModes.IMPORT)}
        disabled={!this.canAddFiles}
      >
        <span {...this.addClasses('ico', 'import')}>import_export</span>
        <span {...this.addClasses('label')}>Import</span>
      </Button>
    );

    return {
      add,
      importFromAchilles,
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
        isEditable={this.isEditable}
        canBeReimported={this.canAddFiles && code.removable && !this.isLocked}
        isLocked={this.isLocked}
        reimportCode={this.reimportCode}
        removeCode={this.removeCode}
        key={key}
        removable={code.removable}
      />
    );
  }

  getActions() {
    return (<ActionsLine
      canAddFiles={this.canAddFiles && !this.isLocked}
      openCreateCodeModal={this.openCreateCodeModal}
      openSubmitModal={this.openSubmitModal}
      canSubmit={this.canSubmit}
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
    this.canSubmit = this.props.canSubmit;
    this.canAddFiles = this.props.canAddFiles;
    this.isEditable = this.props.isEditable;
    this.canBeReimported = this.props.canBeReimported;
    this.isExecutableSelected = this.props.isExecutableSelected;

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
        </ul>
        {this.isSubmittable &&
          this.getActions()
        }
        {this.isLoading &&
          <LoadingPanel active={this.isLoading} />
        }
      </Panel>
    );
  }
}
