import type { Source } from 'apis/models/sources';

/** Matches table semantics: "Available" row (not Paused, active). */
export function isSourceAvailableForDisplay(source: Source): boolean {
  return Boolean(source.active && !source.paused);
}

/** "Unavailable" filter bucket = not in the Available bucket (includes Paused). */
export function sourceMatchesAvailabilityFilter(source: Source, filterValue: string): boolean {
  const v = filterValue.toLowerCase();
  if (v === 'available') {
    return isSourceAvailableForDisplay(source);
  }
  if (v === 'unavailable') {
    return !isSourceAvailableForDisplay(source);
  }
  return true;
}
