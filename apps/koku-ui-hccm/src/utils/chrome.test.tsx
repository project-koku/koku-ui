import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { withChrome } from './chrome';

const getUser = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: { getUser },
  }),
}));

const Probe = ({ chrome }: { chrome: { isOrgAdmin?: boolean } }) => (
  <div>{chrome.isOrgAdmin ? 'org-admin' : 'not-admin'}</div>
);

const ProbeWithChrome = withChrome(Probe);

describe('withChrome', () => {
  beforeEach(() => {
    getUser.mockReset();
  });

  test('passes isOrgAdmin when the user is an org admin', async () => {
    getUser.mockResolvedValue({ identity: { user: { is_org_admin: true } } });
    render(<ProbeWithChrome />);
    expect(await screen.findByText('org-admin')).toBeInTheDocument();
  });

  test('falls back to false when the identity payload is missing', async () => {
    getUser.mockResolvedValue({});
    render(<ProbeWithChrome />);
    expect(await screen.findByText('not-admin')).toBeInTheDocument();
  });
});
