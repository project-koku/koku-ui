import { routes } from '../routes'
import { formatPath, getReleasePath, usePathname } from './paths'
import { useLocation } from 'react-router-dom'

jest.mock('../init', () => ({
  basename: '/openshift/cost-management'
}))

// 1) single top‐level mock
jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn(),
}))
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>

describe('utils/paths', () => {
  const setWindowPathname = (pathname: string) => {
    window.history.replaceState({}, '', pathname)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('formatPath without release prefix', () => {
    expect(formatPath(routes.overview.path)).toBe('/openshift/cost-management')
    expect(formatPath(routes.costModel.basePath))
      .toBe(`/openshift/cost-management${routes.costModel.basePath}`)
  })

  test.each([
    { pathname: '/beta/openshift/cost-management', expected: '/beta' },
    { pathname: '/preview/openshift/cost-management', expected: '/preview' },
    { pathname: '/openshift/cost-management', expected: '' },
  ])('getReleasePath for $pathname', ({ pathname, expected }) => {
    setWindowPathname(pathname)
    expect(getReleasePath()).toBe(expected)
  })

  test('formatPath with release prefix', () => {
    setWindowPathname('/beta/openshift/cost-management')
    expect(formatPath(routes.costModel.basePath, true).startsWith('/beta')).toBe(true)
  })

  test('usePathname collapses cost model UUID path', () => {
    const base = formatPath(routes.costModel.basePath)
    setWindowPathname(`${base}/123`)
    mockUseLocation.mockReturnValue({ pathname: `${base}/123` })
    expect(usePathname()).toBe(base)
  })
})