import {
  INSIGHTS_NOTIFICATION_DEFAULT_DISMISS_MS,
  type OnPremAddNotification,
  type OnPremNotificationConfig,
  registerOnPremAddNotification,
  setOnPremNotificationsHostFlag,
} from '@koku-ui/ui-lib/onPremNotificationsHost';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { createStore } from '@redhat-cloud-services/frontend-components-notifications/state';
import { ScalprumProvider } from '@scalprum/react-core';
import React, { useLayoutEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppLayout from './AppLayout';

setOnPremNotificationsHostFlag();

const notificationsStore = createStore();

(window as any).insights = {
  chrome: {
    auth: {
      getUser: async () => ({
        identity: {
          user: {
            is_org_admin: true,
            email: '',
            first_name: '',
            is_active: true,
            is_internal: false,
            last_name: '',
            locale: 'en',
            username: '',
          },
          org_id: '',
          type: '',
        },
        entitlements: {},
      }),
    } as any,
    getUserPermissions: async () => [],
    on: () => {},
  } as any,
};

const config = {
  costManagement: {
    name: 'costManagement',
    manifestLocation: '/costManagement/plugin-manifest.json',
  },
  costManagementRos: {
    name: 'costManagementRos',
    manifestLocation: '/costManagementRos/plugin-manifest.json',
  },
  sources: {
    name: 'sources',
    manifestLocation: '/sources/plugin-manifest.json',
  },
};

/**
 * Registers the same `addNotification` as NotificationsProvider (the `createStore()` instance).
 * Do not use `useAddNotification()` here: webpack can duplicate the notifications package so the
 * hook’s React context may not match the provider, yielding a no-op addNotification.
 *
 * Merges `dismissDelay` (Insights toast auto-dismiss) — defaults to {@link INSIGHTS_NOTIFICATION_DEFAULT_DISMISS_MS}
 * unless the caller passes `dismissDelay` or `defaultDismissDelayMs` prop overrides the host default.
 */
const OnPremNotificationsBridge: React.FC<{
  /** Same dispatcher as `NotificationsProvider` / `createStore()` (Insights store). */
  addNotification: (notification: OnPremNotificationConfig & Record<string, unknown>) => void;
  /** Override default auto-dismiss for all toasts unless a per-toast `dismissDelay` is set. */
  defaultDismissDelayMs?: number;
}> = ({ addNotification, defaultDismissDelayMs = INSIGHTS_NOTIFICATION_DEFAULT_DISMISS_MS }) => {
  // No cleanup: React Strict Mode would otherwise clear the window bridge between double-invoked effects.
  useLayoutEffect(() => {
    const bridged: OnPremAddNotification = notificationConfig => {
      addNotification({
        ...notificationConfig,
        dismissDelay: notificationConfig.dismissDelay ?? defaultDismissDelayMs,
      });
    };
    registerOnPremAddNotification(bridged);
  }, [addNotification, defaultDismissDelayMs]);
  return null;
};

const App = () => {
  return (
    <ScalprumProvider config={config} api={{}}>
      <NotificationsProvider store={notificationsStore}>
        {/* Insights store typing is wider than OnPremNotificationConfig; runtime shape is compatible */}
        <OnPremNotificationsBridge
          addNotification={
            notificationsStore.addNotification as (c: OnPremNotificationConfig & Record<string, unknown>) => void
          }
        />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </NotificationsProvider>
    </ScalprumProvider>
  );
};

export default App;
