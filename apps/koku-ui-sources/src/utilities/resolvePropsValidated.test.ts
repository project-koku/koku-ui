import resolvePropsValidated from './resolvePropsValidated';

describe('resolvePropsValidated', () => {
  it('returns helperText when validating', () => {
    expect(resolvePropsValidated({}, { meta: { validating: true } })).toEqual({ helperText: 'Validating...' });
  });

  it('returns validated success when valid', () => {
    expect(resolvePropsValidated({}, { meta: { validating: false, valid: true } })).toEqual({ validated: 'success' });
  });

  it('returns empty object by default', () => {
    expect(resolvePropsValidated({}, { meta: { validating: false, valid: false } })).toEqual({});
  });
});
