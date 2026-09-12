import { useLocation } from 'react-router-dom';
import { routes } from 'routes';

import { formatPath, getReleasePath, usePathname } from './paths';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

describe('utils/paths', () => {
  const setWindowPathname = (pathname: string) => {
    window.history.replaceState({}, '', pathname);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('formatPath without release prefix', () => {
    expect(formatPath(routes.welcome.path)).toBe('/staging/cost-management/ros');
    expect(formatPath(routes.optimizationsDetails.path)).toBe(
      `/staging/cost-management/ros${routes.optimizationsDetails.path}`
    );
  });

  test.each([
    { pathname: '/beta/staging/cost-management/ros', expected: '/beta' },
    { pathname: '/preview/staging/cost-management/ros', expected: '/preview' },
    { pathname: '/staging/cost-management/ros', expected: '' },
  ])('getReleasePath for $pathname', ({ pathname, expected }) => {
    setWindowPathname(pathname);
    expect(getReleasePath()).toBe(expected);
  });

  test('usePathname strips a trailing slash', () => {
    mockUseLocation.mockReturnValue({ pathname: '/staging/cost-management/ros/' } as any);
    expect(usePathname()).toBe('/staging/cost-management/ros');
  });
});
