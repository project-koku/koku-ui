import { OptimizationType } from 'utils/commonTypes';

import { getIdKeyForTab } from './optimizationsBreakdown';

describe('getIdKeyForTab', () => {
  test('maps optimization types to tab keys', () => {
    expect(getIdKeyForTab(OptimizationType.cost)).toBe('cost');
    expect(getIdKeyForTab(OptimizationType.performance)).toBe('performance');
  });
});
