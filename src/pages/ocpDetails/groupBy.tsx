import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { GetComputedOcpReportItemsParams } from 'utils/getComputedOcpReportItems';
import { getIdKeyForGroupBy } from 'utils/getComputedOcpReportItems';
import { styles } from './groupBy.styles';

interface GroupByOwnProps {
  onItemClicked(value: string);
  queryString?: string;
}

interface GroupByStateProps {
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

interface State {
  currentItem?: string;
  isGroupByOpen: boolean;
}

type GroupByProps = GroupByOwnProps &
  GroupByStateProps &
  GroupByDispatchProps &
  InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: GetComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
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

  public componentDidMount() {
    const { queryString, report } = this.props;
    if (!report) {
      this.props.fetchReport(OcpReportType.tag, queryString);
    }
    this.setState({
      currentItem: this.getGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.tag, this.props.queryString);
      this.setState({ currentItem: this.getGroupBy() });
    }
  }

  public handleGroupByClick = (event, value) => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      this.setState({
        currentItem: value,
      });
      onItemClicked(value);
    }
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

  private getDropDownTags = () => {
    const { report, t } = this.props;

    if (report && report.data) {
      return report.data.map(val => (
        <DropdownItem
          component="button"
          key={`tag:${val}`}
          onClick={event => this.handleGroupByClick(event, `tag:${val}`)}
        >
          {t('group_by.tag', { key: val })}
        </DropdownItem>
      ));
    } else {
      return [];
    }
  };

  private getGroupBy = () => {
    const queryFromRoute = parseQuery<OcpQuery>(location.search);
    const groupBy = getIdKeyForGroupBy(queryFromRoute.group_by);
    return groupBy !== 'date' ? groupBy : 'project';
  };

  private handleGroupBySelect = event => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  public render() {
    const { t } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const dropdownItems = [
      ...this.getDropDownItems(),
      ...this.getDropDownTags(),
    ];

    const index = currentItem ? currentItem.indexOf('tag:') : -1;
    const label =
      index !== -1
        ? t('group_by.tag', { key: currentItem.slice(4) })
        : t(`group_by.values.${currentItem}`);

    return (
      <div>
        <Title className={css(styles.title)} size="2xl">
          {t('ocp_details.title')}
        </Title>
        <div className={css(styles.groupBySelector)}>
          <label className={css(styles.groupBySelectorLabel)}>
            {t('group_by.charges')}:
          </label>
          <Dropdown
            onSelect={this.handleGroupBySelect}
            toggle={
              <DropdownToggle onToggle={this.handleGroupByToggle}>
                {label}
              </DropdownToggle>
            }
            isOpen={isGroupByOpen}
            dropdownItems={dropdownItems}
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
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    key_only: true,
  });
  const report = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.tag,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.tag,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: GroupByDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const GroupBy = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GroupByBase)
);

export { GroupBy, GroupByBase, GroupByProps };
