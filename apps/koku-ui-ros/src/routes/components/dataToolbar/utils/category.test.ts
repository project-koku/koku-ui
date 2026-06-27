import { CriteriaType } from './criteria';
import {
  getCategorySelectOptions,
  getDefaultCategoryOptions,
  onCategoryInput,
  onCategoryInputSelect,
} from './category';
import { defaultFilters } from './common';

describe('getDefaultCategoryOptions', () => {
  test('returns name category option', () => {
    const options = getDefaultCategoryOptions();

    expect(options).toHaveLength(1);
    expect(options[0].key).toBe('name');
  });
});

describe('getCategorySelectOptions', () => {
  test('maps category options to select options', () => {
    const options = getCategorySelectOptions([
      { name: 'Name', key: 'name' },
      { name: 'Project', key: 'project' },
    ]);

    expect(options).toHaveLength(2);
    expect(options[0].value).toBe('name');
    expect(options[0].toString()).toBe('Name');
  });
});

describe('onCategoryInput', () => {
  const currentFilters = { ...defaultFilters, name: [] };

  test('returns empty object for non-enter key', () => {
    expect(onCategoryInput({ event: { key: 'Tab' }, currentFilters })).toEqual({});
  });

  test('returns empty object for blank input', () => {
    expect(onCategoryInput({ event: { key: 'Enter' }, categoryInput: '  ,', currentFilters })).toEqual({});
  });

  test('adds filter on enter', () => {
    const result = onCategoryInput({
      event: { key: 'Enter' },
      categoryInput: 'test,,',
      currentCategory: 'name',
      currentCriteria: CriteriaType.include,
      currentFilters,
      key: 'name',
    });

    expect(result.filter?.value).toBe('test');
    expect(result.filters?.name).toHaveLength(1);
  });

  test('replaces filter when not multi select', () => {
    const filters = { ...defaultFilters, name: [{ value: 'old', type: 'name' }] };
    const result = onCategoryInput({
      event: { key: 'Enter' },
      categoryInput: 'new',
      currentCategory: 'name',
      currentCriteria: CriteriaType.include,
      currentFilters: filters,
      key: 'name',
      isMultiSelect: false,
    });

    expect(result.filters?.name[0]).toEqual(
      expect.objectContaining({ type: 'name', value: 'new', excludeType: CriteriaType.include })
    );
  });
});

describe('onCategoryInputSelect', () => {
  const currentFilters = { ...defaultFilters, project: [] };

  test('returns empty object for blank value', () => {
    expect(onCategoryInputSelect({ value: '  ', currentFilters })).toEqual({});
  });

  test('adds selected filter value', () => {
    const result = onCategoryInputSelect({
      value: 'my-project',
      currentCategory: 'project',
      currentCriteria: CriteriaType.exclude,
      currentFilters,
      key: 'project',
    });

    expect(result.filter?.value).toBe('my-project');
    expect(result.filters?.project[0].excludeType).toBe(CriteriaType.exclude);
  });
});
