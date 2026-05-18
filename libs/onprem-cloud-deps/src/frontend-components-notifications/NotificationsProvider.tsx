import React, { createContext } from 'react';

import type { NotificationStore } from './state';

export type NotificationContextValue = {
  addNotification: NotificationStore['addNotification'];
  clearNotifications: NotificationStore['clearNotifications'];
};

export const NotificationContext = createContext<NotificationContextValue>({
  addNotification: () => {},
  clearNotifications: () => {},
});

interface NotificationsProviderProps {
  store: NotificationStore;
}

const NotificationsProvider: React.FC<React.PropsWithChildren<NotificationsProviderProps>> = ({
  children,
  store,
}) => (
  <NotificationContext.Provider
    value={{
      addNotification: store.addNotification.bind(store),
      clearNotifications: store.clearNotifications.bind(store),
    }}
  >
    {children}
  </NotificationContext.Provider>
);

export default NotificationsProvider;
