/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Cumarav
 * Created: January 22, 2020
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal} from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';

require('./style.scss');

function ModalUpdateDescription(props){

    const {newDescription} = props;
    const classes = new BEMHelper('analysis-form-update-description');

    const fields = [
        // {
        //     name: 'description',
        //     InputComponent: {
        //         component: FormInput,
        //         props: {
        //             mods: ['bordered'],
        //             //value: newDescription,
        //             //text: newDescription,
        //             type: 'text',
        //         },
        //     },
        // },
    ];

    const submitBtn = {
        label: 'Update',
        loadingLabel: 'Saving...',
        mods: ['success', 'rounded'],
    };

    const cancelBtn = {
        label: 'Skip',
    };

    return(
        <Modal modal={props.modal} title="Update description">
            <div {...classes()}>
                <p>Would you like to replace the existing description with the:</p>
                <p>{newDescription}</p>
                <Form
                    mods="spacing-sm"
                    fields={fields}
                    submitBtn={submitBtn}
                    cancelBtn={cancelBtn}
                    onSubmit={props.doSubmit}
                    onCancel={props.modal.close}
                    {...props}
                />
            </div>
        </Modal>
    );
}

export default ModalUpdateDescription;