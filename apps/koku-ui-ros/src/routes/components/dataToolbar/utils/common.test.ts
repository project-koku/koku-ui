import { CriteriaType } from './criteria';
import {
  cleanInput,
  defaultFilters,
  getActiveFilters,
  getChips,
  getDefaultCategory,
  getFilter,
  getFilters,
  hasFilters,
  onDelete,
} from './common';
import { awsCategoryKey, awsCategoryPrefix, exactPrefix, orgUnitIdKey, tagKey, tagPrefix } from 'utils/props';

describe('cleanInput', () => {
  test('removes trailing commas and ampersands', () => {
    expect(cleanInput('value,,')).toBe('value');
    expect(cleanInput('value&&')).toBe('value');
  });
});

describe('getFilter and getFilters', () => {
  test('creates filter objects', () => {
    const filter = getFilter('name', 'test', CriteriaType.include);
    expect(filter).toEqual({ type: 'name', value: 'test', excludeType: CriteriaType.include, toString: undefined });

    const filters = getFilters('name', ['a', 'b'], CriteriaType.exclude);
    expect(filters).toHaveLength(2);
    expect(filters[0].value).toBe('a');
    expect(filters[1].excludeType).toBe(CriteriaType.exclude);
  });
});

describe('getActiveFilters', () => {
  test('parses filter_by values', () => {
    const query = { filter_by: { name: ['foo', 'bar'] } };
    const filters = getActiveFilters(query);

    expect(filters.name).toHaveLength(2);
    expect(filters.name[0].value).toBe('foo');
  });

  test('parses exact and exclude filters', () => {
    const query = {
      filter_by: { [`${exactPrefix}name`]: 'exact-value' },
      exclude: { cluster: 'excluded-cluster' },
    };
    const filters = getActiveFilters(query);

    expect(filters.name[0].value).toBe('exact-value');
    expect(filters.name[0].excludeType).toBe(CriteriaType.exact);
    expect(filters.cluster[0].value).toBe('excluded-cluster');
    expect(filters.cluster[0].excludeType).toBe(CriteriaType.exclude);
  });

  test('parses tag and aws category filters', () => {
    const tagName = 'env';
    const categoryName = 'Application';
    const query = {
      filter_by: {
        [`${tagPrefix}${tagName}`]: 'prod',
        [`${awsCategoryPrefix}${categoryName}`]: 'web',
      },
    };
    const filters = getActiveFilters(query);

    expect(filters.tag[tagName][0].value).toBe('prod');
    expect(filters[awsCategoryKey][categoryName][0].value).toBe('web');
  });
});

describe('getChips', () => {
  test('returns chip nodes for filters', () => {
    const chips = getChips([
      { value: 'foo', excludeType: CriteriaType.exact },
      { value: 'bar', excludeType: CriteriaType.exclude },
      { value: 'baz' },
    ]);

    expect(chips).toHaveLength(3);
    expect(chips[0].key).toBe('foo');
    expect(chips[2].key).toBe('baz');
  });
});

describe('getDefaultCategory', () => {
  const categoryOptions = [
    { name: 'Name', key: 'name' },
    { name: 'Project', key: 'project' },
  ];

  test('returns org unit when grouped by org unit', () => {
    const query = { group_by: { [orgUnitIdKey]: '*' } };
    expect(getDefaultCategory(categoryOptions, 'name', query)).toBe(orgUnitIdKey);
  });

  test('returns matching category or first option', () => {
    expect(getDefaultCategory(categoryOptions, 'project', {})).toBe('project');
    expect(getDefaultCategory(categoryOptions, 'unknown', {})).toBe('name');
    expect(getDefaultCategory(null, 'name', {})).toBe('name');
  });

  test('returns tag key when group by tag prefix', () => {
    const optionsWithTag = [...categoryOptions, { name: 'Tag', key: tagKey }];
    expect(getDefaultCategory(optionsWithTag, `${tagPrefix}env`, {})).toBe(tagKey);
  });
});

describe('hasFilters', () => {
  test('returns true when filters exist', () => {
    expect(hasFilters({ name: [{ value: 'foo' }] })).toBe(true);
    expect(hasFilters({ tag: { env: [{ value: 'prod' }] } })).toBe(true);
    expect(hasFilters({ [awsCategoryKey]: { Application: [{ value: 'web' }] } })).toBe(true);
  });

  test('returns false when no filters exist', () => {
    expect(hasFilters(defaultFilters)).toBe(false);
    expect(hasFilters(undefined)).toBe(false);
  });
});

describe('onDelete', () => {
  const currentFilters = {
    ...defaultFilters,
    name: [
      { value: 'foo', type: 'name' },
      { value: 'bar', type: 'name' },
    ],
    tag: {
      env: [{ value: 'prod', type: 'env' }],
    },
    [awsCategoryKey]: {
      Application: [{ value: 'web', type: 'Application' }],
    },
  };

  test('removes a standard filter chip', () => {
    const { filter, filters } = onDelete('name', { key: 'foo' }, currentFilters);

    expect(filter?.value).toBe('foo');
    expect(filters.name).toHaveLength(1);
    expect(filters.name[0].value).toBe('bar');
  });

  test('removes tag and aws category filters', () => {
    const tagResult = onDelete(`${tagPrefix}env`, { key: 'prod' }, currentFilters);
    expect(tagResult.filters.tag.env).toHaveLength(0);

    const awsResult = onDelete(`${awsCategoryPrefix}Application`, { key: 'web' }, currentFilters);
    expect(awsResult.filters[awsCategoryKey].Application).toHaveLength(0);
  });

  test('clears all filters when type is null', () => {
    const { filter, filters } = onDelete(null, null, currentFilters);

    expect(filter).toBeNull();
    expect(filters).toEqual(defaultFilters);
  });
});
