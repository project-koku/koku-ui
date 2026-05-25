import React, { createContext, useMemo } from 'react';

import type { NotificationStore } from './state';

export interface NotificationContextValue {
  addNotification: NotificationStore['addNotification'];
  clearNotifications: NotificationStore['clearNotifications'];
}

export const NotificationContext = createContext<NotificationContextValue>({
  addNotification: () => {},
  clearNotifications: () => {},
});

interface NotificationsProviderProps {
  store: NotificationStore;
}

const NotificationsProvider: React.FC<React.PropsWithChildren<NotificationsProviderProps>> = ({ children, store }) => {
  const value = useMemo(
    () => ({
      addNotification: store.addNotification.bind(store),
      clearNotifications: store.clearNotifications.bind(store),
    }),
    [store]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationsProvider;
