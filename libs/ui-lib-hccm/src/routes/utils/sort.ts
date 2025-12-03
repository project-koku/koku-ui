export const enum SortDirection {
  asc,
  desc,
}

interface BaseSortOptions {
  direction?: SortDirection;
}

interface ObjectSortOptions<T> extends BaseSortOptions {
  key?: keyof T;
}

type SortOptions<T> = T extends string ? BaseSortOptions : ObjectSortOptions<T>;

function getValueForItem<T>(item: T, options: SortOptions<T>) {
  if (typeof item === 'string') {
    return item;
  }
  const sortKey = (options as ObjectSortOptions<T>).key;
  return item[sortKey];
}

export function sort<T>(array: T[], options: SortOptions<T>): T[] {
  const { direction = SortDirection.asc } = options || {};
  return [...array].sort((a, b) => {
    const aVal = direction === SortDirection.asc ? getValueForItem(a, options) : getValueForItem(b, options);
    const bVal = direction === SortDirection.asc ? getValueForItem(b, options) : getValueForItem(a, options);

    if (aVal > bVal) {
      return -1;
    }
    if (aVal < bVal) {
      return 1;
    }

    return 0;
  });
}
