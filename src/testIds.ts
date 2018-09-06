export const testIdProp = 'data-testid';
export const getTestProps = (id: string) => ({ [testIdProp]: id });

export const testIds = {
  login: {
    alert: 'alert',
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
  providers: {
    add_btn: 'add-btn',
    bucket_input: 'bucket-input',
    cancel_btn: 'cancel-btn',
    name_input: 'provider-name-input',
    resource_name_input: 'provider-resource-name-input',
    submit_btn: 'submit-btn',
    type_input: 'provider-type-input',
  },
  sidebar: {
    nav: 'vertical-nav',
    link: 'vertical-nav-link',
    backdrop: 'sidebar-backdrop',
  },
};
