export type NotificationStore = {
  addNotification: (config: Record<string, unknown>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const createStore = (): NotificationStore => {
  const notifications: Array<Record<string, unknown>> = [];

  return {
    addNotification: (config) => {
      notifications.push(config);
    },
    removeNotification: () => {},
    clearNotifications: () => {
      notifications.length = 0;
    },
  };
};
