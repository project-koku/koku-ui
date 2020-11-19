import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagKey, tagPrefix } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupByTag } from './groupByTag';

interface GroupByOwnProps extends WithTranslation {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options: {
    label: string;
    value: string;
  }[];
  queryString?: string;
  reportPathsType: ReportPathsType;
  showOrgs?: boolean;
  showTags?: boolean;
}

interface GroupByStateProps {
  orgReport?: Report;
  orgReportFetchStatus?: FetchStatus;
  tagReport?: Report;
  tagReportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface GroupByState {
  currentItem?: string;
  defaultItem: string;
  isGroupByOpen: boolean;
  isGroupByOrgVisible: boolean;
  isGroupByTagVisible: boolean;
}

type GroupByProps = GroupByOwnProps & GroupByStateProps & GroupByDispatchProps;

const groupByOrgOptions: {
  label: string;
  value: string;
}[] = [{ label: orgUnitIdKey, value: orgUnitIdKey }];

const groupByTagOptions: {
  label: string;
  value: string;
}[] = [{ label: tagKey, value: tagKey }];

const orgReportType = ReportType.org;
const tagReportType = ReportType.tag;

class GroupByBase extends React.Component<GroupByProps> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
    isGroupByOrgVisible: false,
    isGroupByTagVisible: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupByClick = this.handleGroupByClick.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType, showOrgs, showTags } = this.props;
    if (showOrgs) {
      fetchReport(reportPathsType, orgReportType, queryString);
    }
    if (showTags) {
      fetchReport(reportPathsType, tagReportType, queryString);
    }
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const { fetchReport, groupBy, queryString, reportPathsType, showOrgs, showTags } = this.props;
    if (prevProps.groupBy !== groupBy) {
      if (showOrgs) {
        fetchReport(reportPathsType, orgReportType, queryString);
      }
      if (showTags) {
        fetchReport(reportPathsType, tagReportType, queryString);
      }
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  public handleGroupByClick = value => {
    const { onItemClicked } = this.props;

    if (value === orgUnitIdKey || value === tagKey) {
      this.setState({
        currentItem: value,
        isGroupByOrgVisible: value === orgUnitIdKey,
        isGroupByTagVisible: value === tagKey,
      });
    } else {
      this.setState({
        currentItem: value,
        isGroupByOrgVisible: false,
        isGroupByTagVisible: false,
      });
      if (onItemClicked) {
        onItemClicked(value);
      }
    }
  };

  private getGroupByItems = () => {
    const { options, orgReport, tagReport, t } = this.props;

    const allOptions = [...options];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    return allOptions.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleGroupByClick(option.value)}>
        {t(`group_by.values.${option.label}`)}
      </DropdownItem>
    ));
  };

  private getCurrentGroupBy = () => {
    const { getIdKeyForGroupBy } = this.props;
    const { defaultItem } = this.state;

    const queryFromRoute = parseQuery<Query>(location.search);
    if (!(queryFromRoute && queryFromRoute.group_by)) {
      return defaultItem;
    }

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    for (const key of groupByKeys) {
      let index = key.indexOf(tagPrefix);
      if (index !== -1) {
        groupBy = tagKey;
        this.setState({
          isGroupByTagVisible: true,
        });
        break;
      }
      index = key.indexOf(orgUnitIdKey);
      if (index !== -1) {
        groupBy = orgUnitIdKey;
        this.setState({
          isGroupByOrgVisible: true,
        });
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : defaultItem;
  };

  private handleGroupBySelect = () => {
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
    const { getIdKeyForGroupBy, groupBy, isDisabled = false, onItemClicked, orgReport, t, tagReport } = this.props;
    const { currentItem, isGroupByOpen, isGroupByOrgVisible, isGroupByTagVisible } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <label style={styles.groupBySelectorLabel}>{t('group_by.view')}:</label>
        <Dropdown
          onSelect={this.handleGroupBySelect}
          toggle={
            <DropdownToggle isDisabled={isDisabled} onToggle={this.handleGroupByToggle}>
              {t(`group_by.values.${currentItem}`)}
            </DropdownToggle>
          }
          isOpen={isGroupByOpen}
          dropdownItems={[this.getGroupByItems()]}
        />
        {Boolean(isGroupByOrgVisible) && (
          <GroupByOrg
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={isDisabled}
            onItemClicked={onItemClicked}
            options={groupByOrgOptions}
            report={orgReport}
          />
        )}
        {Boolean(isGroupByTagVisible) && (
          <GroupByTag
            groupBy={groupBy}
            isDisabled={isDisabled}
            onItemClicked={onItemClicked}
            options={groupByTagOptions}
            report={tagReport}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>((state, { reportPathsType }) => {
  const queryString = getQuery({
    // key_only: true
  });
  const orgReport = reportSelectors.selectReport(state, reportPathsType, orgReportType, queryString);
  const orgReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    orgReportType,
    queryString
  );
  const tagReport = reportSelectors.selectReport(state, reportPathsType, tagReportType, queryString);
  const tagReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    tagReportType,
    queryString
  );
  return {
    queryString,
    orgReport,
    orgReportFetchStatus,
    tagReport,
    tagReportFetchStatus,
  };
});

const mapDispatchToProps: GroupByDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const GroupBy = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(GroupByBase));

export { GroupBy, GroupByProps };
