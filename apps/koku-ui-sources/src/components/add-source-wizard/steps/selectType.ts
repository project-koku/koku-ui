import { SOURCE_TYPES_INTEGRATIONS_UI } from 'api/sourceTypes';
import { sourceTypeIconMap } from 'components/sourcesPage/sourceTypeIcons';
import type { FormatMessage } from 'utilities/asyncValidateName';

const iconMapper = (value: string) => sourceTypeIconMap[value] ?? null;

export function getSelectTypeStep(formatMessage: FormatMessage) {
  return {
    name: 'select-type',
    title: formatMessage('sources.wizardSelectTypeTitle'),
    nextStep: 'source-name',
    fields: [
      {
        component: 'card-select',
        name: 'source_type',
        label: formatMessage('sources.wizardSelectTypeFieldLabel'),
        isRequired: true,
        iconMapper,
        options: SOURCE_TYPES_INTEGRATIONS_UI.map(st => ({
          value: st.id,
          label: st.product_name,
        })),
        validate: [{ type: 'required' }],
      },
    ],
  };
}
