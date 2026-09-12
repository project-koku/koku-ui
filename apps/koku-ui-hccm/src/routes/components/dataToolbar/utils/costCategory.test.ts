import { awsCategoryKey } from 'utils/props';

import { defaultFilters } from './common';
import {
  getCostCategoryKeyOptions,
  getCostCategoryKeySelect,
  onCostCategoryValueInput,
  onCostCategoryValueSelect,
} from './costCategory';
import { CriteriaType } from './criteria';

describe('getCostCategoryKeyOptions', () => {
  test('returns options from keyed report data', () => {
    const options = getCostCategoryKeyOptions({
      data: [
        { key: 'cost-center', type: 'aws_category' },
        { key: 'cost-center', type: 'aws_category' },
      ],
    } as any);

    expect(options).toEqual([expect.objectContaining({ key: 'cost-center', name: 'cost-center' })]);
  });

  test('returns select wrapper options from string data', () => {
    const options = getCostCategoryKeyOptions({ data: ['ops'] } as any, true);
    expect(options).toEqual([expect.objectContaining({ value: 'ops' })]);
    expect((options[0] as any).toString()).toBe('ops');
  });

  test('returns an empty list without report data', () => {
    expect(getCostCategoryKeyOptions({} as any)).toEqual([]);
  });
});

describe('getCostCategoryKeySelect', () => {
  test('returns null unless the cost category is selected', () => {
    expect(getCostCategoryKeySelect({ currentCategory: 'name', resourceReport: { data: [] } as any })).toBeNull();
  });
});

describe('onCostCategoryValueInput', () => {
  test('returns undefined for non-enter keys and blank input', () => {
    expect(onCostCategoryValueInput({ event: { key: 'Tab' }, costCategoryKeyValueInput: 'ops' })).toBeUndefined();
    expect(onCostCategoryValueInput({ event: { key: 'Enter' }, costCategoryKeyValueInput: '  ' })).toBeUndefined();
  });

  test('adds a cost category value filter', () => {
    const result = onCostCategoryValueInput({
      costCategoryKeyValueInput: 'ops',
      currentCostCategoryKey: 'cost-center',
      currentCriteria: CriteriaType.include,
      currentFilters: defaultFilters,
      event: { key: 'Enter' },
    });

    expect(result.filter?.value).toBe('ops');
    expect(result.filters?.[awsCategoryKey]['cost-center']).toHaveLength(1);
  });

  test('does not duplicate an existing value', () => {
    const currentFilters = {
      ...defaultFilters,
      [awsCategoryKey]: {
        'cost-center': [{ value: 'ops', type: 'aws_category:cost-center' }],
      },
    };
    const result = onCostCategoryValueInput({
      costCategoryKeyValueInput: 'ops',
      currentCostCategoryKey: 'cost-center',
      currentFilters,
      event: { key: 'Enter' },
    });

    expect(result.filters).toEqual(currentFilters);
  });
});

describe('onCostCategoryValueSelect', () => {
  test('adds a selected cost category value', () => {
    const result = onCostCategoryValueSelect({
      currentCostCategoryKey: 'cost-center',
      currentCriteria: CriteriaType.include,
      currentFilters: defaultFilters,
      event: { target: { checked: true } },
      selection: { value: 'ops', toString: () => 'ops' },
    });

    expect(result.filter?.value).toBe('ops');
    expect(result.filters?.[awsCategoryKey]['cost-center']).toHaveLength(1);
  });

  test('removes an unchecked cost category value', () => {
    const currentFilters = {
      ...defaultFilters,
      [awsCategoryKey]: {
        'cost-center': [{ value: 'ops', type: 'aws_category:cost-center' }],
      },
    };
    const result = onCostCategoryValueSelect({
      currentCostCategoryKey: 'cost-center',
      currentFilters,
      event: { target: { checked: false } },
      selection: { value: 'ops', toString: () => 'ops' },
    });

    expect(result.filters?.[awsCategoryKey]['cost-center']).toHaveLength(0);
  });
});
