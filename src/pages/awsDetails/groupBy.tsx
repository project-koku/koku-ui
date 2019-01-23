import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery } from 'api/awsQuery';
import { parseQuery } from 'api/awsQuery';
import { AwsReport } from 'api/awsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { GetComputedAwsReportItemsParams } from 'utils/getComputedAwsReportItems';
import { getIdKeyForGroupBy } from 'utils/getComputedAwsReportItems';
import { styles } from './awsDetails.styles';

interface GroupByOwnProps {
  onItemClicked(value: string);
  queryString?: string;
}

interface GroupByStateProps {
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

interface State {
  isGroupByOpen: boolean;
}

type GroupByProps = GroupByOwnProps &
  GroupByStateProps &
  GroupByDispatchProps &
  InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: GetComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class GroupByBase extends React.Component<GroupByProps> {
  protected defaultState: State = {
    isGroupByOpen: false,
  };
  public state: State = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupByClick = this.handleGroupByClick.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public handleGroupByClick = (event, value) => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  public handleGroupBySelect = event => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  public handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  private getDropDownItems = () => {
    const { t } = this.props;

    return groupByOptions.map(option => (
      <DropdownItem
        component="button"
        key={option.value}
        onClick={event => this.handleGroupByClick(event, option.value)}
      >
        {t(`group_by.values.${option.label}`)}
      </DropdownItem>
    ));
  };

  private getGroupBy = () => {
    const queryFromRoute = parseQuery<AwsQuery>(location.search);
    return getIdKeyForGroupBy(queryFromRoute.group_by);
  };

  public render() {
    const { t } = this.props;
    const { isGroupByOpen } = this.state;
    const groupBy = this.getGroupBy();

    return (
      <div>
        <Title className={css(styles.title)} size="2xl">
          {t('aws_details.title')}
        </Title>
        <div className={css(styles.groupBySelector)}>
          <label className={css(styles.groupBySelectorLabel)}>
            {t('group_by.charges')}:
          </label>
          <Dropdown
            onSelect={this.handleGroupBySelect}
            toggle={
              <DropdownToggle onToggle={this.handleGroupByToggle}>
                {t(`group_by.values.${groupBy}`)}
              </DropdownToggle>
            }
            isOpen={isGroupByOpen}
            dropdownItems={this.getDropDownItems()}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  GroupByOwnProps,
  GroupByStateProps
>(state => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: GroupByDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const GroupBy = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GroupByBase)
);

export { GroupBy, GroupByBase, GroupByProps };
