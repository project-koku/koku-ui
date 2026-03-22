import type { MockSourceRow } from './sourcesDataset';

function parseNonNegativeInt(searchParams: URLSearchParams, key: string, defaultValue: number): number {
  const raw = searchParams.get(key);
  if (raw === null || raw === '') {
    return defaultValue;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : defaultValue;
}

/**
 * Mirrors listSources query params from koku-ui-sources `sourcesSlice` / `listSources`.
 */
export function filterSortPaginateSources<T extends MockSourceRow>(
  all: readonly T[],
  requestUrl: string
): { data: T[]; meta: { count: number } } {
  const url = new URL(requestUrl);
  const sp = url.searchParams;

  let rows: T[] = [...all];

  const nameParam = sp.get('name');
  if (nameParam !== null && nameParam !== '') {
    const needle = nameParam.toLowerCase();
    rows = rows.filter(row => row.name.toLowerCase().includes(needle));
  }

  const typeParam = sp.get('type');
  if (typeParam !== null && typeParam !== '') {
    rows = rows.filter(row => row.source_type === typeParam);
  }

  if (sp.has('active')) {
    const wantActive = sp.get('active') === 'true';
    rows = rows.filter(row => row.active === wantActive);
  }

  if (sp.has('paused')) {
    const wantPaused = sp.get('paused') === 'true';
    rows = rows.filter(row => row.paused === wantPaused);
  }

  const ordering = sp.get('ordering');
  if (ordering === 'name' || ordering === '-name') {
    const desc = ordering === '-name';
    rows.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      return desc ? -cmp : cmp;
    });
  }

  const count = rows.length;

  const limitRaw = parseNonNegativeInt(sp, 'limit', 10);
  const limit = Math.max(1, limitRaw);
  const offset = parseNonNegativeInt(sp, 'offset', 0);
  const data = rows.slice(offset, offset + limit);

  return { data, meta: { count } };
}
