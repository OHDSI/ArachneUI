import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellText as Cell,
  Checkbox,
} from 'arachne-components';
import { push } from 'react-router-redux';
import { Field, FormProps } from 'redux-form';
import { Vocabulary } from './selectors';

require('./style.scss');

interface IDownloadCheckboxProps {
  options: {
    className: string;
  };
  input: any;
};

interface ICellProps {
  className: string;
  isCheckable: boolean;
  name: string;
};

interface IResultsStateProps {
  areAllChecked: boolean;
  areAllRowsChecked: boolean;
  sorting: string;
  vocabularies: Array<Vocabulary>;
  initialValues: Object;
};

interface IResultsDispatchProps {
  toggleAll: (on: boolean) => (dispatch: Function) => any;
  toggle: (id: number, on: boolean) => (dispatch: Function) => any;
};

interface IResultsProps extends IResultsStateProps, IResultsDispatchProps {
  toggleAllCheckboxes: () => (dispatch: Function) => any;
  setSorting: Function;
};

function DownloadCheckbox(props: IDownloadCheckboxProps) {
  const { options, /*redux-form*/ input } = props;
  return (<Checkbox
      className={options.className}
      isChecked={input.value}
    />);
}

function CellChecked(props: any) {
  const { className, isCheckable, name } = props;
  return isCheckable
    ? <Field component={DownloadCheckbox} options={{ className }} name={name} />
    : <span className={`${className}--disabled`}>vpn_key</span>;
}

function Results(props: IResultsProps & FormProps<{}, {}, {}>) {
  const {
    areAllRowsChecked,
    vocabularies,
    sorting,
    setSorting,
    toggleAllCheckboxes,
    toggle,
  } = props;
  const classes = BEMHelper('vocabularies');
  const selectAllButton = <Checkbox onChange={toggleAllCheckboxes} isChecked={areAllRowsChecked} />;

  return (
    <div {...classes()}>
      <Table
        {...classes('table')}
        data={vocabularies}
        mods={['hover', 'padded', 'selectable']}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={(vocab: Vocabulary) => {
            if(vocab.isCheckable) {
              toggle(vocab.id, !vocab.isChecked);
            }
          }
        }
      >
        <CellChecked
          {...classes('selection')}
          header={selectAllButton}
          field='isChecked'
          props={(vocab: Vocabulary) => ({
            isCheckable: vocab.isCheckable,
            name: `vocabulary[${vocab.id}]`,
            className: classes({
              element: 'cell',
              modifiers: { unclickable: vocab.isCheckable },
            }).className,
          })}
         />
        <Cell
          {...classes('id')}
          header='ID (CDM v4.5)'
          field='id'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('code')}
          header='CODE (CDM v5)'
          field='code'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('name')}
          header='Name'
          field='name'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('required')}
          header='Required'
          field='required'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('update')}
          header='Update'
          field='update'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
      </Table>
    </div>
  );
}

export default Results;
export {
  IResultsStateProps,
  IResultsDispatchProps,
  IResultsProps,
};
