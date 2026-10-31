import React, { type ReactNode } from 'react';

/**
 * On-prem has no Kessel API. Render children and report allowed so AppEntry can mount.
 * Sources write access still comes from getUserPermissions while the Kessel flag is off.
 */
const Provider = ({ children }: { children?: ReactNode }) => <React.Fragment>{children}</React.Fragment>;

export const AccessCheck = { Provider };

export const useSelfAccessCheck = () => ({
  data: { allowed: true },
  error: undefined,
  loading: false,
});

export const fetchDefaultWorkspace = async () => ({ id: 'default' });
