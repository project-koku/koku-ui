import { useContext } from 'react';

import { NotificationContext } from './NotificationsProvider';

export const useAddNotification = () => {
  const ctx = useContext(NotificationContext);
  return ctx.addNotification;
};

export const useClearNotifications = () => {
  const ctx = useContext(NotificationContext);
  return ctx.clearNotifications;
};

export const useNotifications = () => ({
  notifications: [],
  clearNotifications: () => {},
  removeNotification: () => {},
  addNotification: () => {},
});

export const useRemoveNotification = () => () => {};
