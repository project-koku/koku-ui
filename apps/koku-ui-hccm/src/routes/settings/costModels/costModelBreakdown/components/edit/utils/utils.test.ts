import messages from 'locales/messages';

import { validateDescription, validateName } from './utils';

describe('edit/utils', () => {
  describe('validateDescription', () => {
    test('returns null within limit', () => {
      expect(validateDescription('ok')).toBeNull();
      expect(validateDescription('a'.repeat(500))).toBeNull();
    });

    test('returns too-long message', () => {
      expect(validateDescription('a'.repeat(501))).toBe(messages.costModelsDescTooLong);
    });
  });

  describe('validateName', () => {
    test('returns required for empty or whitespace', () => {
      expect(validateName('')).toBe(messages.requiredField);
      expect(validateName('   ')).toBe(messages.requiredField);
    });

    test('returns null for valid name', () => {
      expect(validateName('Cost model')).toBeNull();
    });

    test('returns too-long message', () => {
      expect(validateName('a'.repeat(101))).toBe(messages.costModelsNameTooLong);
    });
  });
});
