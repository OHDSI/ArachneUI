import { FormInput, FormSelect } from 'arachne-ui-components';

export default function ({ analysisTypes }) {
  return [
    {
      name: 'title',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Title',
          type: 'text',
        },
      },
    },
    {
      name: 'typeId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Type',
          options: analysisTypes,
        },
      },
    },
  ];
}
