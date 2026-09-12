import { mockDate } from './testUtils';

describe('mockDate', () => {
  const OriginalDate = Date;

  afterEach(() => {
    global.Date = OriginalDate;
  });

  test('returns a constant date when constructed without arguments', () => {
    mockDate(2);
    expect(new (Date as any)().getFullYear()).toBe(2018);
    expect(new (Date as any)().getDate()).toBe(2);
    expect(new (Date as any)('2020-01-01').getUTCFullYear()).toBe(2020);
  });
});
