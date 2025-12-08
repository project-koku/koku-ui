interface NotificationsProviderProps {
  store: unknown;
}

const NotificationsProvider: React.FC<React.PropsWithChildren<NotificationsProviderProps>> = ({ children }) => children;

export default NotificationsProvider;
