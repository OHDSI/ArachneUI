import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { FormInput, Button, ListItem, Link } from 'arachne-ui-components';
import { Field } from 'redux-form';

require('./style.scss');

export default function EmailListInput({ fields }) {
    const classes = BEMHelper('email-list-input');
    const addButtonTitle = fields.length > 0 ? 'Add another email' : 'Add email';
    return (
        <div {...classes()}>
            <div {...classes('fields-container')}>
                {fields.map((field, index) => (
                    <ListItem
                        {...classes('email-input-container')}
                        key={index}
                        mods={['removable', 'borderless']}
                        onRemove={() => fields.remove(index)}
                    >
                        <Field
                            name={field}
                            placeholder="Email"
                            component={FormInput}
                            type="email"
                        />
                    </ListItem>
                ))}
            </div>

            <div {...classes('add-button-container')}>
                <Link {...classes('add-button')} onClick={() => fields.push('')}>
                    <span {...classes('icon')}>add_circle_outline</span>
                    <span {...classes('label')}>{addButtonTitle}</span>
                </Link>
            </div>

            <Button
                disabled={fields.length === 0}
                {...classes('submit')}
                type="submit"
                mods={['success', 'rounded']}
            >
                Share
            </Button>
        </div>
    );
}
