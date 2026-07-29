import { normalize } from './normailize';

describe('normalize', () => {
  test('lowercases and replaces hyphens for status keys', () => {
    expect(normalize('in-progress')).toBe('in_progress');
    expect(normalize('COMPLETE')).toBe('complete');
  });

  test('strips -local so source message keys match', () => {
    expect(normalize('AWS-local')).toBe('aws');
    expect(normalize('Azure-local')).toBe('azure');
    expect(normalize('GCP-local')).toBe('gcp');
    expect(normalize('aws')).toBe('aws');
  });

  test('returns undefined for empty values', () => {
    expect(normalize('')).toBeUndefined();
    expect(normalize(undefined as unknown as string)).toBeUndefined();
  });
});
