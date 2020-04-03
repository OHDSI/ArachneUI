/*
 *
 * Copyright 2020 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alex Cumarav
 * Created: March 30, 2020
 *
 */


import * as React from 'react';
import BEMHelper from "services/BemHelper";

import { Button, Form, FormDatepicker, FormInput, FormToggle, LoadingPanel } from 'arachne-ui-components';
import { commonDateFormat } from "const/formats";

require('./style.scss');

interface IStatisticsFilter {
    from: any,
    to: any,
    keywords?: string,
    licensedOnly?: boolean,
}

interface IStatisticsFilterProps extends IStatisticsFilterStateProps, IStatisticsFilterDispatchProps, IStatisticsFilterOwnProps {
    handleSubmit: Function
}

interface IStatisticsFilterDispatchProps {
    loadStatistics: Function
}

interface IStatisticsFilterStateProps {
    isLoading: boolean,
    downloadCsvLink: string,
    filter: IStatisticsFilter
}

interface IStatisticsFilterOwnProps {
    runSearch: Function;
}

function Filters(props: IStatisticsFilterStateProps) {
    const classes = BEMHelper('filters');

    const fields = [
        {
            name: 'keywords',
            InputComponent: {
                component: FormInput,
                props: {
                    title: 'Keywords',
                    placeholder: 'Keywords',
                    type: 'text',
                },
            },
        },
        {
            name: 'from',
            InputComponent: {
                component: FormDatepicker,
                props: {
                    title: 'From',
                    type: 'text',
                    options: {
                        selected: props.filter.from,
                        dateFormat: commonDateFormat,
                    },
                }

            }
        },
        {
            name: 'to',
            InputComponent: {
                component: FormDatepicker,
                props: {
                    title: 'To',
                    type: 'text',
                    options: {
                        selected: props.filter.to,
                        dateFormat: commonDateFormat,
                    },
                }

            }
        },
        {
            name: 'licensedOnly',
            InputComponent: {
                component: FormToggle,
                props: {
                    label: 'License Only',
                }

            }
        }
    ];
    const submitBtn = {
        label: 'Show',
        loadingLabel: 'Loading...',
        mods: ['success', 'rounded'],
    };

    return (
        <div {...classes()}>
            <div>
                <Form
                    {...props}
                    fields={fields}
                    submitBtn={submitBtn}
                />
            </div>
            <div>

                <Button
                    {...classes({
                        element: 'export-button',

                    })}
                    mods={['rounded']}
                    link={props.downloadCsvLink}
                    target='_self'
                >
                    Export CSV
                </Button>
            </div>
            <LoadingPanel active={props.isLoading}/>


        </div>);
}

export default Filters;
export {
    IStatisticsFilter,
    IStatisticsFilterStateProps,
    IStatisticsFilterDispatchProps,
    IStatisticsFilterProps,
    IStatisticsFilterOwnProps
}