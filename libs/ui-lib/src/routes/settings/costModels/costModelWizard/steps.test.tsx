import { descriptionErrors, nameErrors, validatorsHash } from './steps';

const md = (id: string) => ({ id, defaultMessage: id } as any);
jest.mock('@koku-ui/i18n/locales/messages', () => ({
  __esModule: true,
  default: {
    costModelsRequiredField: { id: 'required' },
    costModelsInfoTooLong: { id: 'name-too-long' },
    costModelsDescTooLong: { id: 'desc-too-long' },
  },
}));

describe('costModelWizard/steps validators', () => {
  test.each([
    ['', md('required')],
    [Array(102).fill('a').join(''), md('name-too-long')],
    ['ok', null],
  ])('nameErrors %#', (name, expected) => {
    expect(nameErrors(name)?.id || null).toBe((expected as any)?.id || null);
  });

  test.each([
    ['', null],
    [Array(502).fill('a').join(''), md('desc-too-long')],
  ])('descriptionErrors %#', (desc, expected) => {
    expect(descriptionErrors(desc)?.id || null).toBe((expected as any)?.id || null);
  });

  const baseCtx: any = {
    name: 'ok',
    description: 'ok',
    type: 'AWS',
    priceListCurrent: { justSaved: true },
    markup: '10',
  };

  test.each([
    ['AWS'],
    ['Azure'],
    ['GCP'],
  ])('validatorsHash basic provider flow %#', provider => {
    const checks = validatorsHash[provider as keyof typeof validatorsHash];
    const ctx = { ...baseCtx, type: provider };
    expect(checks[0](ctx)).toBe(true);
    expect(checks[1](ctx)).toBe(true);
  });

  test('validatorsHash OCP adds price list and extra steps', () => {
    const checks = validatorsHash['OCP'];
    const ctx = { ...baseCtx, type: 'OCP' };
    expect(checks[0](ctx)).toBe(true);
    expect(checks[1](ctx)).toBe(true); // priceListCurrent.justSaved
    expect(checks[2](ctx)).toBe(true); // markup valid
  });

  test.each(['', 'abc', '10.12345678901'])('invalid markup %#', value => {
    const checks = validatorsHash['AWS'];
    const ctx = { ...baseCtx, markup: value };
    expect(checks[1](ctx)).toBe(false);
  });
}); 