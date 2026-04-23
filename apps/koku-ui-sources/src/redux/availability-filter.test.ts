import type { Source } from 'apis/models/sources';

import { isSourceAvailableForDisplay, sourceMatchesAvailabilityFilter } from './availability-filter';

const base: Pick<Source, 'active' | 'paused'> = { active: true, paused: false };

describe('availability-filter', () => {
  it('isSourceAvailableForDisplay is true only when active and not paused', () => {
    expect(isSourceAvailableForDisplay({ ...base, active: true, paused: false } as Source)).toBe(true);
    expect(isSourceAvailableForDisplay({ ...base, active: false, paused: false } as Source)).toBe(false);
    expect(isSourceAvailableForDisplay({ ...base, active: true, paused: true } as Source)).toBe(false);
  });

  it('sourceMatchesAvailabilityFilter unavailable includes paused and inactive', () => {
    expect(sourceMatchesAvailabilityFilter({ ...base, active: true, paused: false } as Source, 'unavailable')).toBe(
      false
    );
    expect(sourceMatchesAvailabilityFilter({ ...base, active: false, paused: false } as Source, 'unavailable')).toBe(
      true
    );
    expect(sourceMatchesAvailabilityFilter({ ...base, active: true, paused: true } as Source, 'unavailable')).toBe(
      true
    );
  });

  it('sourceMatchesAvailabilityFilter available matches display Available', () => {
    expect(sourceMatchesAvailabilityFilter({ ...base, active: true, paused: false } as Source, 'available')).toBe(
      true
    );
    expect(sourceMatchesAvailabilityFilter({ ...base, active: true, paused: true } as Source, 'available')).toBe(
      false
    );
  });
});
