import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Resource, ResourcePathsType } from '@koku-ui/api/resources/resource';
import { ResourceType } from '@koku-ui/api/resources/resource';
import messages from '@koku-ui/i18n/locales/messages';
import { SearchInput } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../store/common';
import { createMapStateToProps } from '../../../store/common';
import { resourceActions, resourceSelectors } from '../../../store/resources';
import { orgUnitIdKey } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../utils/groupBy';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectCheckboxWrapper } from '../selectWrapper';

interface CostCategoryValueOwnProps extends RouterComponentProps, WrappedComponentProps {
  isDisabled?: boolean;
  onCostCategoryValueSelect(event, selection);
  onCostCategoryValueInput(event);
  onCostCategoryValueInputChange(value: string);
  selections?: SelectWrapperOption[];
  costCategoryKey: string;
  costCategoryKeyValue: string;
  resourcePathsType: ResourcePathsType;
}

interface CostCategoryValueStateProps {
  groupBy?: string;
  groupByValue?: string | number;
  resourceQueryString?: string;
  resourceReport?: Resource;
  resourceReportFetchStatus?: FetchStatus;
}

interface CostCategoryValueDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
}

interface CostCategoryValueState {
  costCategoryKeyValueInput?: string;
}

type CostCategoryValueProps = CostCategoryValueOwnProps & CostCategoryValueStateProps & CostCategoryValueDispatchProps;

const resourceType = ResourceType.aws_category;

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const costCategoryKeyValueLimit = 50;

class CostCategoryValueBase extends React.Component<CostCategoryValueProps, CostCategoryValueState> {
  protected defaultState: CostCategoryValueState = {
    // TBD...
  };
  public state: CostCategoryValueState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: CostCategoryValueProps) {
    const { resourceQueryString, resourcePathsType } = this.props;

    if (prevProps.resourceQueryString !== resourceQueryString || prevProps.resourcePathsType !== resourcePathsType) {
      this.updateReport();
    }
  }

  private getCostCategoryValueOptions(): SelectWrapperOption[] {
    const { costCategoryKey, resourceReport } = this.props;

    let data = [];
    if (resourceReport?.data) {
      data = [...new Set([...resourceReport.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (costCategoryKey === tag.key && tag.values) {
          options = tag.values.map(val => {
            return {
              toString: () => val, // Tag key values not localized
              value: val,
            };
          });
          break;
        }
      }
    }
    return options;
  }

  private onCostCategoryValueChange = (value: string) => {
    const { onCostCategoryValueInputChange } = this.props;

    this.setState({ costCategoryKeyValueInput: value }, () => {
      if (onCostCategoryValueInputChange) {
        onCostCategoryValueInputChange(value);
      }
    });
  };

  private updateReport = () => {
    const { fetchResource, resourceQueryString, resourcePathsType } = this.props;
    fetchResource(resourcePathsType, resourceType, resourceQueryString);
  };

  public render() {
    const { intl, isDisabled, onCostCategoryValueInput, onCostCategoryValueSelect, selections, costCategoryKeyValue } =
      this.props;

    const selectOptions = this.getCostCategoryValueOptions();

    if (selectOptions.length > 0 && selectOptions.length < costCategoryKeyValueLimit) {
      return (
        <SelectCheckboxWrapper
          id="cost-category-select"
          isDisabled={isDisabled}
          onSelect={onCostCategoryValueSelect}
          options={selectOptions}
          placeholder={intl.formatMessage(messages.chooseValuePlaceholder)}
          selections={selections}
        />
      );
    }
    return (
      <SearchInput
        aria-label={intl.formatMessage(messages.filterByCostCategoryValueButtonAriaLabel)}
        id="tag-key-value-input"
        isDisabled={isDisabled}
        onChange={(_evt, value) => this.onCostCategoryValueChange(value)}
        onClear={() => this.onCostCategoryValueChange('')}
        onSearch={evt => onCostCategoryValueInput(evt)}
        placeholder={intl.formatMessage(messages.filterByValuePlaceholder)}
        value={costCategoryKeyValue}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<CostCategoryValueOwnProps, CostCategoryValueStateProps>(
  (state, { router, costCategoryKey, resourcePathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const resourceQueryString = getQuery({
      key: costCategoryKey,
    });
    const resourceReport = resourceSelectors.selectResource(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );
    const resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );

    return {
      groupBy,
      groupByValue,
      resourceQueryString,
      resourceReport,
      resourceReportFetchStatus,
    };
  }
);

const mapDispatchToProps: CostCategoryValueDispatchProps = {
  fetchResource: resourceActions.fetchResource,
};

const CostCategoryValueConnect = connect(mapStateToProps, mapDispatchToProps)(CostCategoryValueBase);
const CostCategoryValue = injectIntl(withRouter(CostCategoryValueConnect));

export { CostCategoryValue };
