import type { AlertProps } from '@patternfly/react-core';
import React from 'react';

import { useAddNotification, useClearNotifications, useNotifications, useRemoveNotification } from '../init';

export interface Notification {
  description?: string;
  dismissable?: boolean;
  id?: string;
  title: string;
  variant: AlertProps['variant'];
}

export interface NotificationProps {
  addNotification: any;
  clearNotifications: any;
  notifications: any;
  removeNotification: any;
}

export interface NotificationComponentProps {
  notification: NotificationProps;
}

// See https://github.com/RedHatInsights/frontend-components/blob/master/packages/notifications/doc/notifications.md
export const withNotification = Component => {
  function ComponentNotificationProp(props) {
    const addNotification = useAddNotification();
    const clearNotifications = useClearNotifications();
    const notifications = useNotifications();
    const removeNotification = useRemoveNotification();
    return (
      <Component {...props} notification={{ addNotification, clearNotifications, notifications, removeNotification }} />
    );
  }

  return ComponentNotificationProp;
};
