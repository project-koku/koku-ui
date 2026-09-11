import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { withChrome } from './chrome';

const mockGetUser = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
  }),
}));

const Probe = ({ chrome }: { chrome: { isOrgAdmin?: boolean } }) => (
  <div data-testid="org-admin">{String(!!chrome.isOrgAdmin)}</div>
);

describe('withChrome', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
  });

  test('renders nothing until chrome is initialized', () => {
    mockGetUser.mockReturnValue(new Promise(() => undefined));
    const Wrapped = withChrome(Probe);
    const { container } = render(<Wrapped />);
    expect(container).toBeEmptyDOMElement();
  });

  test('passes isOrgAdmin when the user is an org admin', async () => {
    mockGetUser.mockResolvedValue({ identity: { user: { is_org_admin: true } } });
    const Wrapped = withChrome(Probe);
    render(<Wrapped />);

    expect(await screen.findByTestId('org-admin')).toHaveTextContent('true');
  });

  test('returns false when identity is missing', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    const Wrapped = withChrome(Probe);
    render(<Wrapped />);
    expect(await screen.findByTestId('org-admin')).toHaveTextContent('false');
  });

  test('stays uninitialized when getUser never resolves', () => {
    mockGetUser.mockReturnValue(new Promise(() => undefined));
    const Wrapped = withChrome(Probe);
    const { container } = render(<Wrapped />);
    expect(container).toBeEmptyDOMElement();
  });

  test('does not update state after unmount', async () => {
    let resolveUser: (value: unknown) => void = () => undefined;
    mockGetUser.mockReturnValue(
      new Promise(resolve => {
        resolveUser = resolve;
      })
    );

    const Wrapped = withChrome(Probe);
    const { unmount } = render(<Wrapped />);
    unmount();
    resolveUser({ identity: { user: { is_org_admin: true } } });

    await waitFor(() => {
      expect(screen.queryByTestId('org-admin')).not.toBeInTheDocument();
    });
  });
});
