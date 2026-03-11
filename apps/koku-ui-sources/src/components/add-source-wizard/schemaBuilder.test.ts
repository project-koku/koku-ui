import { buildWizardSchema } from './schemaBuilder';

describe('buildWizardSchema', () => {
  it('includes selectType step when no preselectedType', () => {
    const schema = buildWizardSchema();
    const wizard = schema.fields[0];
    expect(wizard.component).toBe('wizard');
    expect(wizard.fields.length).toBe(7);
  });

  it('excludes selectType step when preselectedType is given', () => {
    const schema = buildWizardSchema('OCP');
    const wizard = schema.fields[0];
    expect(wizard.fields.length).toBe(6);
  });

  it('sets crossroads on source_type', () => {
    const schema = buildWizardSchema();
    expect(schema.fields[0].crossroads).toEqual(['source_type']);
  });

  it('names the wizard add-source-wizard', () => {
    const schema = buildWizardSchema();
    expect(schema.fields[0].name).toBe('add-source-wizard');
  });
});
