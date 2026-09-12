import { tagKey } from 'utils/props';

import { CriteriaType } from './criteria';
import { defaultFilters } from './common';
import { getTagKeyOptions, getTagKeySelect, onTagValueInput, onTagValueSelect } from './tags';

describe('getTagKeyOptions', () => {
  test('merges keys from the report and previously applied filters', () => {
    const options = getTagKeyOptions(
      {
        data: [
          { key: 'env', values: ['prod'] },
          { key: 'env', values: ['stage'] },
        ],
      } as any,
      { ...defaultFilters, tag: { app: [{ value: 'koku', type: 'tag:app' }] } }
    );

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'env', name: 'env' }),
        expect.objectContaining({ key: 'app', name: 'app' }),
      ])
    );
  });

  test('returns select wrapper options and handles string-only report data', () => {
    const selectOptions = getTagKeyOptions({ data: ['env', 'app'] } as any, undefined, true);
    expect(selectOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'env' }),
        expect.objectContaining({ value: 'app' }),
      ])
    );
    expect((selectOptions[0] as any).toString()).toBe('env');
  });

  test('returns an empty list when there is no report data', () => {
    expect(getTagKeyOptions({} as any, undefined)).toEqual([]);
  });
});

describe('getTagKeySelect', () => {
  test('returns null unless the tag category is selected', () => {
    expect(getTagKeySelect({ currentCategory: 'name', tagReport: { data: [] } as any })).toBeNull();
  });
});

describe('onTagValueInput', () => {
  test('returns an empty object for non-enter keys and blank input', () => {
    expect(onTagValueInput({ event: { key: 'Tab' }, tagKeyValueInput: 'prod' })).toEqual({});
    expect(onTagValueInput({ event: { key: 'Enter' }, tagKeyValueInput: '  ' })).toEqual({});
  });

  test('adds a tag value filter', () => {
    const result = onTagValueInput({
      currentCriteria: CriteriaType.include,
      currentFilters: defaultFilters,
      currentTagKey: 'env',
      event: { key: 'Enter' },
      tagKeyValueInput: 'prod',
    });

    expect(result.filter?.value).toBe('prod');
    expect(result.filters?.tag.env).toHaveLength(1);
  });

  test('does not duplicate an existing value', () => {
    const currentFilters = {
      ...defaultFilters,
      [tagKey]: undefined,
      org_unit_id: [{ value: 'prod', type: 'tag:env' }],
    };
    const result = onTagValueInput({
      currentFilters,
      currentTagKey: 'env',
      event: { key: 'Enter' },
      tagKeyValueInput: 'prod',
    });

    expect(result.filters).toEqual(currentFilters);
  });
});

describe('onTagValueSelect', () => {
  test('adds a selected tag value', () => {
    const result = onTagValueSelect({
      currentCriteria: CriteriaType.include,
      currentFilters: defaultFilters,
      currentTagKey: 'env',
      event: { target: { checked: true } },
      selection: { value: 'prod', toString: () => 'prod' },
    });

    expect(result.filter?.value).toBe('prod');
    expect(result.filters?.tag.env).toHaveLength(1);
  });

  test('removes an unchecked tag value', () => {
    const currentFilters = {
      ...defaultFilters,
      tag: { env: [{ value: 'prod', type: 'tag:env' }] },
    };
    const result = onTagValueSelect({
      currentFilters,
      currentTagKey: 'env',
      event: { target: { checked: false } },
      selection: { value: 'prod', toString: () => 'prod' },
    });

    expect(result.filters?.tag.env).toHaveLength(0);
  });
});
