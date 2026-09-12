import { getThScreenReaderText } from './thAccessibility';

describe('getThScreenReaderText', () => {
  test('omits screen reader text when the header already has a visible name', () => {
    expect(getThScreenReaderText('Name', 'Column 1')).toBeUndefined();
  });

  test('returns screen reader text for empty headers', () => {
    expect(getThScreenReaderText('', 'Select all')).toBe('Select all');
    expect(getThScreenReaderText('   ', 'Select all')).toBe('Select all');
    expect(getThScreenReaderText(undefined, 'Column 1')).toBe('Column 1');
  });
});
