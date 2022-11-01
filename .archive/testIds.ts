export const testIdProp = 'data-testid';
export const getTestProps = (id: string) => ({ [testIdProp]: id });

export const testIds = {
  details: {
    cluster_lnk: 'cluster-lnk',
    historical_data_btn: 'historical-data-btn',
    show_more_btn: 'show-more-btn',
    tag_lnk: 'tag-lnk',
    view_all_btn: 'view-all-btn',
  },
  export: {
    cancel_btn: 'cancel-btn',
    submit_btn: 'submit-btn',
  },
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
  onboarding: {
    btn_cancel: 'btn-cancel',
    btn_back: 'btn-back',
    btn_continue: 'btn-continue',
    btn_close: 'btn-close',
    type_selector: 'type-selector',
    type_opt_aws: 'type-option-aws',
    type_opt_ocp: 'type-option-ocp',
    type_opt_non: 'type-option-non',
    name_input: 'name-input',
    check_box_1: 'check-box-1',
    check_box_2: 'check-box-2',
    s3_input: 's3-input',
    clusterid_input: 'clusterid-input',
    arn_input: 'arn-input',
  },
  providers: {
    add_btn: 'add-btn',
    bucket_input: 'bucket-input',
    cancel_btn: 'cancel-btn',
    empty_state_add_btn: 'empty_state_add-btn',
    name_input: 'provider-name-input',
    resource_name_input: 'provider-resource-name-input',
    cluster_id_input: 'provider-cluster-id-input',
    submit_btn: 'submit-btn',
    type_input: 'provider-type-input',
  },
  sidebar: {
    nav: 'vertical-nav',
    link: 'vertical-nav-link',
    backdrop: 'sidebar-backdrop',
  },
};
