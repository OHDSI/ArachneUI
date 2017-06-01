import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {FormInput} from 'arachne-components';
require('./style.scss');

interface IFiltersPanelStateProps {

}

interface IFiltersPanelDispatchProps {
}

interface IFiltersPanelProps extends IFiltersPanelStateProps, IFiltersPanelDispatchProps{
}

function FiltersPanel(props: IFiltersPanelProps){
    const classes = BEMHelper('filters-panel');

    return (
        <div>
            <label>Number of parent levels</label><input type="text" />
        </div>
    );
}

export default FiltersPanel;

export {
    IFiltersPanelProps,
    IFiltersPanelDispatchProps,
    IFiltersPanelStateProps
};