import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { ReviewSummary } from 'components/add-source-wizard/ReviewSummary';
import { OcpInstructions } from 'components/add-source-wizard/steps/credentials/OcpInstructions';

import { CardSelect } from './CardSelect';
import { Description } from './Description';
import { PlainText } from './PlainText';
import { Select } from './Select';
import { SubForm } from './SubForm';
import { TextArea } from './TextArea';
import { TextField } from './TextField';
import { WizardMapper } from './WizardMapper';

export const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.TEXTAREA]: TextArea,
  [componentTypes.SELECT]: Select,
  [componentTypes.SUB_FORM]: SubForm,
  [componentTypes.PLAIN_TEXT]: PlainText,
  [componentTypes.WIZARD]: WizardMapper,
  'card-select': CardSelect,
  description: Description,
  'review-summary': ReviewSummary,
  'ocp-instructions': OcpInstructions,
};
