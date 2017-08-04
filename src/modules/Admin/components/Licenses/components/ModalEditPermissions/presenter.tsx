import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
	Modal,
	FormCheckboxList,
	Form,
  TabbedPane,
  RadioButton,
  Button,
} from 'arachne-components';
import { Vocabulary } from 'modules/Admin/components/Licenses/types';
import { Field } from 'redux-form';

require('./style.scss');

function VocRadioButton ({ options, input }) {
  const classes = BEMHelper('pending-radio-btn');

  return <RadioButton
    {...classes()}
    isChecked={input.value === options.value}
    onChange={() => input.onChange(options.value)}
  />;
}

function ModalEditPermissions(props) {
  const {
    modal,
    vocabularies,
    user,
    doSubmit,
    pendingVocabularies,
    handleSubmit,
  } = props;
  const classes = BEMHelper('edit-permissions');

  const sections = [
    {
      label: `Granted (${vocabularies.length})`,
      content: <div {...classes('tab-content')}>
        <Field component={FormCheckboxList} options={vocabularies} name='vocabularies' />
      </div>,
    },
    {
      label: `Pending (${pendingVocabularies.length})`,
      content: <div {...classes('tab-content')}>
        <div {...classes('pending-voc')}>
          <span {...classes('pending-voc-name')}></span>
          <div {...classes('pending-button')}>Allow</div>
          <div {...classes('pending-button')}>Forbid</div>
        </div>
        {pendingVocabularies.map((voc: Vocabulary) =>
          <div {...classes('pending-voc')}>
            <span {...classes('pending-voc-name')}>{voc.name}</span>
            <div {...classes('pending-button')}>
              <Field
                component={VocRadioButton}
                name={`pendingVocabs[${voc.licenseId}]`}
                options={{ value: true }}
              />
            </div>
            <div {...classes('pending-button')}>
              <Field
                component={VocRadioButton}
                name={`pendingVocabs[${voc.licenseId}]`}
                options={{ value: false }}
              />
            </div>
          </div>
        )}
      </div>
    },
  ];

  return (
    <div {...classes()}>
      <Modal modal={modal} title={`Edit permissions for user ${user}`} mods={['no-padding']}>
        <form
          onSubmit={handleSubmit(doSubmit)}
          {...props}
        >
          {pendingVocabularies.length > 0
            ? <TabbedPane sections={sections} />
            : sections[0].content
          }
          <div {...classes('submit-button-wrapper')}>
            <Button {...classes('submit-button')} type='submit' mods={['submit', 'rounded']}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>);
}

export default ModalEditPermissions;
