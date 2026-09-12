import { orgUnitIdKey } from 'utils/props';

import { defaultFilters } from './common';
import { CriteriaType } from './criteria';
import { getOrgUnitOptions, getOrgUnitSelect, onOrgUnitSelect } from './orgUntits';

const orgReport = {
  data: [
    { org_unit_id: 'root', org_unit_name: 'Root', level: 0 },
    { org_unit_id: 'eng', org_unit_name: 'Engineering', level: 1 },
    { org_unit_id: 'ops', org_unit_name: 'Operations', level: 1 },
  ],
} as any;

describe('getOrgUnitOptions', () => {
  test('returns an empty list without report data', () => {
    expect(getOrgUnitOptions({} as any)).toEqual([]);
  });

  test('sorts names and moves root units first', () => {
    const options = getOrgUnitOptions(orgReport);
    expect(options[0]).toEqual(expect.objectContaining({ key: 'root', name: 'Root' }));
    expect(options.map(option => option.name)).toEqual(['Root', 'Engineering', 'Operations']);
  });
});

describe('onOrgUnitSelect', () => {
  test('adds a selected org unit', () => {
    const result = onOrgUnitSelect({
      currentCriteria: CriteriaType.include,
      currentFilters: defaultFilters,
      event: { target: { checked: true } },
      selection: { value: 'eng', toString: () => 'Engineering' },
    });

    expect(result.filter?.value).toBe('eng');
    expect(result.filters?.[orgUnitIdKey]).toHaveLength(1);
  });

  test('removes an unchecked org unit', () => {
    const currentFilters = {
      ...defaultFilters,
      [orgUnitIdKey]: [{ value: 'eng', type: orgUnitIdKey }],
    };
    const result = onOrgUnitSelect({
      currentFilters,
      event: { target: { checked: false } },
      selection: { value: 'eng', toString: () => 'Engineering' },
    });

    expect(result.filters?.[orgUnitIdKey]).toHaveLength(0);
  });
});

describe('getOrgUnitSelect', () => {
  test('builds chips for exact and exclude org unit filters', () => {
    const result = getOrgUnitSelect({
      currentCategory: orgUnitIdKey,
      orgReport,
      filters: {
        ...defaultFilters,
        [orgUnitIdKey]: [
          { value: 'eng', type: orgUnitIdKey, excludeType: CriteriaType.exact },
          { value: 'ops', type: orgUnitIdKey, excludeType: CriteriaType.exclude },
          { value: 'root', type: orgUnitIdKey },
        ],
      },
    });

    expect(result).not.toBeNull();
  });
});
