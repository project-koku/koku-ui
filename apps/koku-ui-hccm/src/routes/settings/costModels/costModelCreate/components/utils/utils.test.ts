import messages from 'locales/messages';

import { validateDescription, validateMarkup, validateName } from './utils';

describe('costModelCreate utils', () => {
  describe('validateDescription', () => {
    test('returns null for valid length', () => {
      expect(validateDescription('short')).toBeNull();
    });

    test('returns too long message when over 500 characters', () => {
      expect(validateDescription('x'.repeat(501))).toBe(messages.costModelsDescTooLong);
    });
  });

  describe('validateMarkup', () => {
    test('returns undefined for valid percentage', () => {
      expect(validateMarkup('10.5')).toBeUndefined();
    });

    test('returns number error for invalid format', () => {
      expect(validateMarkup('abc')).toBe(messages.markupOrDiscountNumber);
    });

    test('returns too long error when more than 10 decimals', () => {
      expect(validateMarkup('1.12345678901')).toBe(messages.markupOrDiscountTooLong);
    });
  });

  describe('validateName', () => {
    test('returns required for whitespace-only name', () => {
      expect(validateName('   ')).toBe(messages.requiredField);
    });

    test('returns null for valid name', () => {
      expect(validateName('My cost model')).toBeNull();
    });

    test('returns too long message when over 100 characters', () => {
      expect(validateName('n'.repeat(101))).toBe(messages.costModelsInfoTooLong);
    });
  });
});
