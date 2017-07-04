import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Select,
  Link,
} from 'arachne-components';
import { paths } from 'modules/Vocabulary/const';
import { Field, FormProps } from 'redux-form';

require('./style.scss');

interface IReduxFieldProps {
  options: any;
  input: any;
};

interface IPanelStateProps {
  selectedVocabularies: Array<string>,
  initialValues: {
    selection: string;
  }
};

interface IPanelDispatchProps {
  showConfirmation: () => (dispatch: Function) => any;
};

interface IPanelProps extends IPanelStateProps, IPanelDispatchProps {
  download: Function;
};

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
    download,
    selectedVocabularies,
  } = props;
  const classes = BEMHelper('vocabulary-control-panel');

  return (
    <div {...classes()}>
      <Field
        component={selection}
        options={{...classes('selection')}}
        name='selection'
      />
      <Link
        {...classes('history-link')}
        to={paths.history()}
      >Show History</Link>
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
