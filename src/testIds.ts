export const testIdProp = 'data-testid';
export const getTestProps = (id: string) => ({ [testIdProp]: id });

export const testIds = {
  login: {
    form: 'login-form',
    username_input: 'username-input',
    password_input: 'password-input',
    submit: 'submit',
  },
  masthead: {
    masthead: 'masthead',
    username: 'username',
    sidebarToggle: 'sidebar-toggle',
    logout: 'logout',
  },
  sidebar: {
    nav: 'vertical-nav',
    link: 'vertical-nav-link',
    backdrop: 'sidebar-backdrop',
  },
};
