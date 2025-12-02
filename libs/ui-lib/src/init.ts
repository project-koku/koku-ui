import { type AsyncComponent as AsyncComponentCloud } from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type {
  useAddNotification as useAddNotificationCloud,
  useClearNotifications as useClearNotificationsCloud,
  useNotifications as useNotificationsCloud,
  useRemoveNotification as useRemoveNotificationCloud,
} from '@redhat-cloud-services/frontend-components-notifications/hooks';
import type { PropsWithChildren } from 'react';

import { configureStore, type RootState } from './store';

export let PageHeader: React.ComponentType<PropsWithChildren>;
export let PageHeaderTitle: React.ComponentType<{ title: React.ReactNode }>;
export let Maintenance: React.ComponentType<{ description: React.ReactNode; titleText?: React.ReactNode }>;
export let Unavailable: React.ComponentType;
export let AsyncComponent: typeof AsyncComponentCloud;

export let useAddNotification: typeof useAddNotificationCloud;
export let useClearNotifications: typeof useClearNotificationsCloud;
export let useNotifications: typeof useNotificationsCloud;
export let useRemoveNotification: typeof useRemoveNotificationCloud;

export let navToggleResizer: (handleResize: VoidFunction) => VoidFunction;

export let getUserIdentity: () => Promise<{ account_number?: string } | undefined>;

interface NotificationFuncs {
  useAddNotification: typeof useAddNotificationCloud;
  useClearNotifications: typeof useClearNotificationsCloud;
  useNotifications: typeof useNotificationsCloud;
  useRemoveNotification: typeof useRemoveNotificationCloud;
}

export interface InitUIProps {
  setNotificationsFuncs: NotificationFuncs;
  navToggleResizer: typeof navToggleResizer;
  configureStore: Partial<RootState>;
  PageHeader: typeof PageHeader;
  PageHeaderTitle: typeof PageHeaderTitle;
  Maintenance: typeof Maintenance;
  Unavailable: typeof Unavailable;
  AsyncComponent: typeof AsyncComponent;
  getUserIdentity: typeof getUserIdentity;
}

export const initUILib = (props: InitUIProps) => {
  PageHeader = props.PageHeader;
  PageHeaderTitle = props.PageHeaderTitle;
  Maintenance = props.Maintenance;
  Unavailable = props.Unavailable;
  AsyncComponent = props.AsyncComponent;

  useAddNotification = props.setNotificationsFuncs.useAddNotification;
  useClearNotifications = props.setNotificationsFuncs.useClearNotifications;
  useNotifications = props.setNotificationsFuncs.useNotifications;
  useRemoveNotification = props.setNotificationsFuncs.useRemoveNotification;

  navToggleResizer = props.navToggleResizer;

  getUserIdentity = props.getUserIdentity;

  const store = configureStore(props.configureStore);
  return store;
};
