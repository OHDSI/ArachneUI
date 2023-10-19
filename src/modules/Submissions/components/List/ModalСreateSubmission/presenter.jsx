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
  environmentList,
  dataSourcesOptionList,
  analysisTypesOptionList,
  isFormValid,
  setAnalysisType,
  setEntryPoint,
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

  const isFilesTab = activeTab === modalSections.FILES || activeTab === modalSections.STRATEGUS;
  const isStrategusTab = activeTab === modalSections.STRATEGUS;
  const placeholder = isFilesTab ? (isStrategusTab ? 'Add json files' : 'Add separate files') : 'Add files in archive';

  const fileField = {
    name: 'file',
    InputComponent: {
      component: FormFileInput,
      props: {
        name: 'zip',
        mods: ['bordered'],
        placeholder,
        dropzonePlaceholder: 'Drag and drop file',
        multiple: isFilesTab && !isStrategusTab,
        accept: isFilesTab ? (isStrategusTab ? ['.json'] : []) : ['.zip'],
        onChangeCustom: populateData,
        filePlaceholder: 'Document name',
      },
    },
  };

  const datasourceField = {
    name: 'datasourceId',
    InputComponent: {
      component: FormSelect,
      props: {
        mods: ['bordered'],
        placeholder: 'Data Source',
        options: dataSourcesOptionList,
        required: true,
      },
    }
  };

  const titleField = {
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
  };

  const studyField = {
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
  };

  const fields = [
    fileField,
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
      name: 'environmentId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Runtime Environment',
          options: environmentList,
          required: true,
        },
      },
    },
    datasourceField,
    titleField,
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
    studyField,
  ];

  const strategusType = 'STRATEGUS';

  const strategusFields = [
      fileField,
      datasourceField,
      titleField,
      studyField,
    {
      name: 'environmentId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Runtime Environment',
          options: environmentList,
          required: true,
        },
      },
    },
    {
        name: 'type',
        InputComponent: {
          component: FormInput,
          props: {
            type: 'hidden',
            input: {
            },
          }
        }
      },
    {
      name: 'executableFileName',
      InputComponent: {
        component: FormInput,
        props: {
          type: 'hidden',
          input: {
          }
        }
      }
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
  const StrategusForm = (<Form
      mods="spacing-em"
      fields={strategusFields}
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
    // {
    //   label: modalSections.FILES,
    //   content: FilesForm,
    // },
    {
      label: modalSections.STRATEGUS,
      content: StrategusForm,
    }
  ];

  const changeTab = (tab) => {
    resetForm();
    if (tab === modalSections.STRATEGUS) {
      setAnalysisType(strategusType);
      setEntryPoint("strategusStudy.json");
    }
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
