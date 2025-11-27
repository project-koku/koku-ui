import { nameErrors, descriptionErrors, validatorsHash } from './steps';

jest.mock('utils/format', () => ({ __esModule: true, countDecimals: (v: string) => (v.split('.')[1]?.length ?? 0), isPercentageFormatValid: (v: string) => /^-?\d+(\.\d+)?$/.test(v) }));

describe('cost model wizard steps validators', () => {
  test.each([
    ['', 'costModelsRequiredField'],
    [new Array(102).join('a'), 'costModelsInfoTooLong'],
    ['ok', null],
  ])('nameErrors(%p) => %p', (name, expectedKey) => {
    const res = nameErrors(name as string);
    expect(res ? (res as any).id : res).toBe(expectedKey);
  });

  test.each([
    ['', null],
    [new Array(502).join('a'), 'costModelsDescTooLong'],
  ])('descriptionErrors(%p) => %p', (desc, expectedKey) => {
    const res = descriptionErrors(desc as string);
    expect(res ? (res as any).id : res).toBe(expectedKey);
  });

  const ctxBase = { name: 'n', description: 'd', type: 't', markup: '1.23', priceListCurrent: { justSaved: true } } as any;

  test.each([
    ['AWS', true, true, true, true],
    ['Azure', true, true, true, true],
    ['GCP', true, true, true, true],
  ])('%s validators success path', (provider, v1, v2, v3, v4) => {
    const vals = validatorsHash[provider as keyof typeof validatorsHash];
    expect(vals[0](ctxBase)).toBe(v1);
    expect(vals[1](ctxBase)).toBe(v2);
    expect(vals[2](ctxBase)).toBe(v3);
    expect(vals[3](ctxBase)).toBe(v4);
  });

  test('OCP validators include priceListCurrent.justSaved and extra steps', () => {
    const vals = validatorsHash.OCP;
    const ok = { ...ctxBase, markup: '0.1', priceListCurrent: { justSaved: true } };
    const bad = { ...ctxBase, markup: '', priceListCurrent: { justSaved: false } };
    expect(vals[0](ok)).toBe(true);
    expect(vals[1](ok)).toBe(true);
    expect(vals[2](ok)).toBe(true);
    expect(vals[3](ok)).toBe(true);
    expect(vals[4](ok)).toBe(true);
    expect(vals[5](ok)).toBe(true);

    expect(vals[0](bad)).toBe(true);
    expect(vals[1](bad)).toBe(false);
    expect(vals[2](bad)).toBe(false);
  });

  test('name/description invalid and markup edge cases', () => {
    const vals = validatorsHash.AWS;
    const tooLongName = { ...ctxBase, name: new Array(102).join('a') };
    const emptyName = { ...ctxBase, name: '' };
    const badMarkup = { ...ctxBase, markup: '12.12345678901' }; // 11 decimals
    const notNumeric = { ...ctxBase, markup: 'abc' };

    expect(vals[0](tooLongName)).toBe(false);
    expect(vals[0](emptyName)).toBe(false);
    expect(vals[1](badMarkup)).toBe(false);
    expect(vals[1](notNumeric)).toBe(false);
  });
}); 