import { type ReactNode, useCallback } from 'react';

let onPremNotificationsHostActive = false;
let addNotificationBridge: OnPremAddNotification | undefined;

/** Called once by `koku-ui-onprem` at startup so federated apps skip duplicate Insights notification provider + portal. */
export function setOnPremNotificationsHostFlag(): void {
  onPremNotificationsHostActive = true;
}

export function isOnPremNotificationsHost(): boolean {
  return onPremNotificationsHostActive;
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

/** Called by the on-prem shell to wire the real Insights notification dispatcher into federated bundles. */
export function registerOnPremAddNotification(fn: OnPremAddNotification | undefined): void {
  addNotificationBridge = fn;
}

function getOnPremAddNotificationBridge(): OnPremAddNotification | undefined {
  return addNotificationBridge;
}

/**
 * On-prem federated modules must use this instead of `useAddNotification` from
 * `@redhat-cloud-services/frontend-components-notifications/hooks` so toasts use the host
 * `NotificationsProvider` (single React context).
 *
 * With Module Federation **`@koku-ui/ui-lib` shared singleton** on on-prem, bridge state lives in this
 * module; host and remotes share one instance. Without singleton sharing, each bundle would duplicate
 * this module and the bridge would not cross runtimes (configure `shared` / `sharedModules` on the
 * on-prem host and remotes).
 */
export function useOnPremAddNotification(): OnPremAddNotification {
  return useCallback(config => {
    getOnPremAddNotificationBridge()?.(config);
  }, []);
}
