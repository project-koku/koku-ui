import { SOURCE_TYPES } from 'api/sourceTypes';
import { sourceTypeIconMap } from 'components/sourcesPage/sourceTypeIcons';

const iconMapper = (value: string) => sourceTypeIconMap[value] ?? null;

export const selectTypeStep = {
  name: 'select-type',
  title: 'Select source type',
  nextStep: 'source-name',
  fields: [
    {
      component: 'card-select',
      name: 'source_type',
      label: 'Select a source type',
      isRequired: true,
      iconMapper,
      options: SOURCE_TYPES.map(st => ({
        value: st.id,
        label: st.product_name,
      })),
      validate: [{ type: 'required' }],
    },
  ],
};
