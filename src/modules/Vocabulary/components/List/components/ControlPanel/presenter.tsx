import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Select,
} from 'arachne-components';
import { cdmVersions } from 'modules/Vocabulary/const';
import { Field, Form } from 'redux-form';
import { DownloadParams } from 'modules/Vocabulary/actions/download';

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
  requestDownload: (params: DownloadParams) => any;
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

function ControlPanel(props: IPanelProps & Form<{}, {}, {}>) {
  const {
    cdmVersion,
    download,
  } = props;
  const classes = BEMHelper('vocabulary-control-panel');

  return (
    <div {...classes()}>
      <Field
        component={cdmVersionSelect}
        options={{...classes('cdm-version-select')}}
        name='cdmVersion'
      />
      <div {...classes('download')}>
        <Field
          component={selection}
          options={{...classes('selection')}}
          name='selection'
        />
        <Button
          {...classes('download-button')}
          mods={['submit', 'rounded']}
          onClick={download}
        >Download vocabularies</Button>
      </div>
    </div>
    );
}

export default ControlPanel;
export {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
};
