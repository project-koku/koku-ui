import { getSourceType } from './sourceType';

describe('deprecated getSourceType', () => {
  test('maps cloud and local source types to API strings', () => {
    expect(getSourceType('Amazon Web Services')).toBe('AWS');
    expect(getSourceType('AWS-local')).toBe('AWS');
    expect(getSourceType('Azure-local')).toBe('Azure');
    expect(getSourceType('GCP-local')).toBe('GCP');
    expect(getSourceType('OCP')).toBe('OCP');
  });

  test('returns undefined for unknown labels', () => {
    expect(getSourceType('Unknown')).toBeUndefined();
  });
});
