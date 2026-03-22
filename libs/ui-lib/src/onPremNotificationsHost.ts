import { type ReactNode, useCallback } from 'react';

/** Window flag set by `koku-ui-onprem` so federated apps skip duplicate Insights notification provider + portal. */
export const ONPREM_NOTIFICATIONS_HOST_FLAG = '__KOKU_ONPREM_NOTIFICATIONS_HOST__';

export function setOnPremNotificationsHostFlag(): void {
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, boolean>)[ONPREM_NOTIFICATIONS_HOST_FLAG] = true;
  }
}

export function isOnPremNotificationsHost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return Boolean((window as unknown as Record<string, boolean>)[ONPREM_NOTIFICATIONS_HOST_FLAG]);
}

/**
 * Default auto-dismiss delay (milliseconds) for Insights `Notification` when `dismissDelay` is omitted.
 * Defined in `@redhat-cloud-services/frontend-components-notifications` (`DEFAULT_DELAY` in Notification).
 */
export const INSIGHTS_NOTIFICATION_DEFAULT_DISMISS_MS = 8000;

/** Matches Insights `addNotification` payloads used by Sources MFE. */
export interface OnPremNotificationConfig {
  variant?: 'success' | 'danger' | 'warning' | 'info' | string;
  title: ReactNode;
  description?: ReactNode;
  dismissable?: boolean;
  /**
   * Auto-dismiss delay in ms, forwarded as `dismissDelay` to Insights notifications.
   * Omit to use {@link INSIGHTS_NOTIFICATION_DEFAULT_DISMISS_MS} (merged by the on-prem host bridge).
   */
  dismissDelay?: number;
}

export type OnPremAddNotification = (config: OnPremNotificationConfig) => void;

const ADD_NOTIFICATION_BRIDGE_KEY = '__KOKU_ONPREM_ADD_NOTIFICATION_BRIDGE__';

/** Called by the on-prem shell to wire the real Insights notification dispatcher into federated bundles. */
export function registerOnPremAddNotification(fn: OnPremAddNotification | undefined): void {
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, OnPremAddNotification | undefined>)[ADD_NOTIFICATION_BRIDGE_KEY] = fn;
  }
}

function getOnPremAddNotificationBridge(): OnPremAddNotification | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as unknown as Record<string, OnPremAddNotification | undefined>)[ADD_NOTIFICATION_BRIDGE_KEY];
}

/**
 * On-prem federated modules must use this instead of `useAddNotification` from
 * `@redhat-cloud-services/frontend-components-notifications/hooks` so toasts use the host
 * `NotificationsProvider` (single React context).
 *
 * The dispatcher is stored on `window` so the host shell and federated bundles (separate webpack
 * runtimes) share one bridge — module-level state would be duplicated per bundle.
 */
export function useOnPremAddNotification(): OnPremAddNotification {
  return useCallback(config => {
    getOnPremAddNotificationBridge()?.(config);
  }, []);
}
