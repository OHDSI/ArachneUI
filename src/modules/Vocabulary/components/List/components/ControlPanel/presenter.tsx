import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Select,
} from 'arachne-components';
import { cdmVersions, paths } from 'modules/Vocabulary/const';
import { Field, FormProps } from 'redux-form';

require('./style.scss');

interface IReduxFieldProps {
  options: any;
  input: any;
};

interface IPanelStateProps {
  cdmVersion: string,
  selectedVocabularies: Array<string>,
  initialValues: {
    cdmVersion: string;
    selection: string;
  }
};

interface IPanelDispatchProps {
  showConfirmation: () => (dispatch: Function) => any;
};

interface IPanelProps extends IPanelStateProps, IPanelDispatchProps {
  download: Function;
};

function cdmVersionSelect(props: IReduxFieldProps) {
  const { options, input } = props;
  return (<Select
    className={options.className}
    options={cdmVersions}
    value={input.value}
    onChange={input.onChange}
   />);
}

function selection(props: IReduxFieldProps) {
  const { options, input } = props;
  return (<Select
    className={options.className}
    options={[
      {
        label: 'Show all',
        value: 'all',
      },
      {
        label: 'Show selected',
        value: 'selected',
      },
    ]}
    value={input.value}
    onChange={input.onChange}
    />);
}

function ControlPanel(props: IPanelProps & FormProps<{}, {}, {}>) {
  const {
    cdmVersion,
    download,
    selectedVocabularies,
  } = props;
  const classes = BEMHelper('vocabulary-control-panel');

  return (
    <div {...classes()}>
      <Field
        component={cdmVersionSelect}
        options={{...classes('cdm-version-select')}}
        name='cdmVersion'
      />
      <Field
        component={selection}
        options={{...classes('selection')}}
        name='selection'
      />
      <Button
        mods={['submit', 'rounded']}
        link={paths.history()}
      >Show History</Button>
      <Button
        {...classes({ element: 'download-button', modifiers: { disabled: !selectedVocabularies.length } })}
        mods={['submit', 'rounded']}
        onClick={download}
        disabled={!selectedVocabularies.length}
      >Download vocabularies</Button>
    </div>
    );
}

export default ControlPanel;
export {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
};
