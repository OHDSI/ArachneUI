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
 * Created: April 20, 2020
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Button, FormInput, Form } from 'arachne-ui-components';
import imgs from 'const/images';

require('./style.scss');

interface ISearchOverviewProps extends ISearchOverviewStateProps, ISearchOverviewOwnProps, ISearchOverviewDispatchProps {
}

interface ISearchOverviewStateProps {
    conditionCount: string,
    deviceCount: string,
    drugCount: string,
    measurementCount: string,
    observationCount: string,
    procedureCount: string,
}

interface ISearchOverviewDispatchProps {
    goToAddress: (address: string) => any;
    fetchTermsCount: () => void;
    runQuerySearch: (query: { searchString: String }) => any;
    runDomainSearch: (domainName: string) => any;
}

type DomainInfo = {
    title: string,
    domainName: string,
    count: string,
    imageUrl: string
};

interface ISearchOverviewOwnProps {
    filter: string,
}

const classes = BEMHelper('start-search-page');

function TermCardsRow(props: { cards: Array<DomainInfo>, onClick: Function }) {
    return (
        <div {...classes({element: 'domainsrow'})}>
            {props.cards.map(card => <TermCard key={card.domainName} {...card} onClick={props.onClick}></TermCard>)}
        </div>
    );
}

const cardClasses = BEMHelper('domaincard');

function TermCard(props) {
    const {title, domainName, count, imageUrl, onClick} = props;

    return (
        <div {...cardClasses('card')} onClick={() => onClick(domainName)}>
            <img src={imageUrl}/>
            <div {...cardClasses('title')}>{title}</div>

            <span {...cardClasses('termsCount')}>
                <img src={imgs.search.negotiation}/>
                {count}</span>
        </div>
    );
}

function SearchOverviewPresenter(props: ISearchOverviewProps) {

    const fields = [
        {
            name: 'searchString',
            InputComponent: {
                component: FormInput,
                props: {
                    type:'string',
                    ...classes('input'),
                    placeholder: 'aspirin',
                }
            }
        }
    ];
    const submitBtn = {
        label: 'Search',
        ...classes('search-button'),
    };

    const firstDomains: Array<DomainInfo> = [
        {
            title: 'Drugs',
            domainName: 'Drug',
            count: props.drugCount,
            imageUrl: imgs.search.drugs
        },
        {
            title: 'Conditions',
            domainName: 'Condition',
            count: props.conditionCount,
            imageUrl: imgs.search.conditions
        },
        {
            title: 'Procedures',
            domainName: 'Procedure',
            count: props.procedureCount,
            imageUrl: imgs.search.procedures
        }
    ];

    const bottomDomains: Array<DomainInfo> = [
        {
            title: 'Devices',
            domainName: 'Device',
            count: props.deviceCount,
            imageUrl: imgs.search.devices
        },
        {
            title: 'Observations',
            domainName: 'Observation',
            count: props.observationCount,
            imageUrl: imgs.search.observations
        },
        {
            title: 'Measurements',
            domainName: 'Measurement',
            count: props.measurementCount,
            imageUrl: imgs.search.measurements
        }
    ];

    return (
        <div {...classes()}>
            <div {...classes({element: 'content-wrapper'})}>
                <div {...classes({element: 'title'})}>
                    Search
                </div>
                <div {...classes('search-string')}>
                    <Form
                        fields={fields}
                        onSubmit={props.runQuerySearch}
                        submitBtn={submitBtn}
                        actionsClassName={classes('search-button-wrapper').className}
                        {...props}
                    />
                </div>
                <div {...classes({element: 'search-tips'})}>
                    <ol>
                        <li>Usage of quotation marks forces an exact-match search</li>
                        <li>In case of a typo, or if there is a similar spelling of the word, the most similar
                            result will be presented
                        </li>
                    </ol>
                </div>
                <div>
                    <div {...classes({element: 'title-domains'})}>Explore domains</div>
                </div>

                <TermCardsRow cards={firstDomains} onClick={props.runDomainSearch}/>
                <TermCardsRow cards={bottomDomains} onClick={props.runDomainSearch}/>
            </div>
        </div>
    );
}

export default SearchOverviewPresenter;
export { ISearchOverviewProps, ISearchOverviewOwnProps, ISearchOverviewStateProps, ISearchOverviewDispatchProps };