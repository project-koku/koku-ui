import { CriteriaType } from './criteria';
import { onCustomSelect } from './custom';
import { defaultFilters } from './common';

describe('onCustomSelect', () => {
  const currentFilters = { ...defaultFilters, status: [] };
  const selection = { value: 'running', toString: () => 'Running' };

  test('adds filter when checked', () => {
    const result = onCustomSelect({
      currentCategory: 'status',
      currentFilters,
      event: { target: { checked: true } },
      selection,
    });

    expect(result.filter?.value).toBe('running');
    expect(result.filters?.status).toHaveLength(1);
  });

  test('removes filter when unchecked', () => {
    const filters = {
      ...defaultFilters,
      status: [{ value: 'running', type: 'status' }],
    };
    const result = onCustomSelect({
      currentCategory: 'status',
      currentFilters: filters,
      event: { target: { checked: false } },
      selection,
    });

    expect(result.filters?.status).toHaveLength(0);
  });

  test('replaces filter when not multi select', () => {
    const result = onCustomSelect({
      currentCategory: 'status',
      currentFilters,
      event: { target: { checked: true } },
      isMultiSelect: false,
      selection,
    });

    expect(result.filters?.status).toHaveLength(1);
    expect(result.filters?.status[0].value).toBe('running');
  });
});
