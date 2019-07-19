import React from 'react';
import { Modal, Form, FormInput, FormFileInput, FormSelect } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ModalCreateSubmission(props) {
  const classes = new BEMHelper('submission-modal-create-submission');
  const {
    populateEntryPointsOptionList,
    entryPointsOptionList,
    dataSourcesOptionList,
    analysisTypesOptionList,
    modal,
    doSubmit,
    clearAndClose,
  } = props;
  const fields = [
    {
      name: 'file',
      InputComponent: {
        component: FormFileInput,
        props: {
          name: 'zip',
          multiple: false,
          mods: ['bordered'],
          onChangeCustom: populateEntryPointsOptionList,
          placeholder: 'Archive',
          filePlaceholder: 'Archive',
          dropzonePlaceholder: 'Drag and drop zip file',
        },
      }
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

  const submitBtn = {
    label: 'Create',
    loadingLabel: 'Creating...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
    <Modal modal={modal} title="Create submission">
      <div {...classes()}>
        <Form
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={doSubmit}
          onCancel={clearAndClose}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalCreateSubmission;