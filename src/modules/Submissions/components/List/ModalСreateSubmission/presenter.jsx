import React from 'react';
import {
  Modal,
  Form,
  FormInput,
  FormFileInput,
  FormSelect,
  TabbedPane,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { sections as modalSections } from 'modules/Submissions/const';

require('./style.scss');

export default function ModalCreateSubmission({
  activeTab,
  setActiveTab,
  modal,
  doSubmit,
  resetForm,
  closeModal,
  populateData,
  entryPointsOptionList,
  dataSourcesOptionList,
  analysisTypesOptionList,
  isFormValid,
  ...props
}) {
  const classes = new BEMHelper('submission-modal-create-submission');

  const submitBtn = {
    label: 'Create',
    loadingLabel: 'Creating...',
    mods: ['success', 'rounded'],
    disabled: !isFormValid,
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  const isFilesTab = activeTab === modalSections.FILES;
  const placeholder = isFilesTab ? 'Add separate files' : 'Add files in archive';

  const fields = [
    {
      name: 'file',
      InputComponent: {
        component: FormFileInput,
        props: {
          name: 'zip',
          mods: ['bordered'],
          placeholder,
          dropzonePlaceholder: 'Drag and drop file',
          multiple: isFilesTab,
          accept: isFilesTab ? [] : ['.zip'],
          onChangeCustom: populateData,
          filePlaceholder: 'Document name',
        },
      },
    },
    {
      name: 'executableFileName',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Entry Point',
          options: entryPointsOptionList,
          required: true,
        },
      },
    },
    {
      name: 'datasourceId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Data Source',
          options: dataSourcesOptionList,
          required: true,
        },
      },
    },
    {
      name: 'title',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Analysis',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'type',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Type',
          options: analysisTypesOptionList,
          required: true,
        },
      },
    },
    {
      name: 'study',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Study',
          required: false,
          type: 'text',
        },
      },
    },
  ];

  const onCancel = () => {
    resetForm();
    closeModal();
    setActiveTab(modalSections.ARCHIVE);
  }
  const FilesForm = (<Form
    mods="spacing-sm"
    fields={fields}
    submitBtn={submitBtn}
    cancelBtn={cancelBtn}
    onSubmit={doSubmit}
    onCancel={onCancel}
    {...props}
  />);

  const sections = [
    {
      label: modalSections.ARCHIVE,
      content: FilesForm,
    },
    {
      label: modalSections.FILES,
      content: FilesForm,
    },
  ];

  const changeTab = (tab) => {
    resetForm();
    setActiveTab(tab);
  };

  return (
    <Modal modal={modal} title="Create submission">
      <div {...classes()}>
        <TabbedPane sections={sections} value={activeTab} onChange={changeTab} />
      </div>
    </Modal>
  );
}
