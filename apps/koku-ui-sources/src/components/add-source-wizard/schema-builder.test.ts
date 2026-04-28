
import { FormatMessage } from '../../utilities/async-validate-name';
import { buildWizardSchema } from './schema-builder';

const formatMessage: FormatMessage = id => id;

describe('buildWizardSchema', () => {
  it('includes source name, OCP credentials, and review steps only', () => {
    const schema = buildWizardSchema(formatMessage);
    const wizard = schema.fields[0];
    expect(wizard.component).toBe('wizard');
    expect(wizard.fields.length).toBe(3);
    expect(wizard.fields.map((f: { name: string }) => f.name)).toEqual(['source-name', 'credentials-OCP', 'review']);
  });

  it('names the wizard add-source-wizard', () => {
    const schema = buildWizardSchema(formatMessage);
    expect(schema.fields[0].name).toBe('add-source-wizard');
  });
});
