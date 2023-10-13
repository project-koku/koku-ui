import type { ToolbarChipGroup } from '@patternfly/react-core';
import { Button, ButtonVariant, InputGroup, InputGroupItem, TextInput } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { ResourceType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/utils/groupBy';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';
import { orgUnitIdKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface CostCategoryValueOwnProps extends RouterComponentProps, WrappedComponentProps {
  isDisabled?: boolean;
  onCostCategoryValueSelect(event, selection);
  onCostCategoryValueInput(event);
  onCostCategoryValueInputChange(value: string);
  selections?: SelectOptionObject[];
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
  isCostCategoryValueExpanded?: boolean;
  costCategoryKeyValueInput?: string;
}

type CostCategoryValueProps = CostCategoryValueOwnProps & CostCategoryValueStateProps & CostCategoryValueDispatchProps;

const resourceType = ResourceType.aws_category;

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const costCategoryKeyValueLimit = 50;

class CostCategoryValueBase extends React.Component<CostCategoryValueProps, CostCategoryValueState> {
  protected defaultState: CostCategoryValueState = {
    isCostCategoryValueExpanded: false,
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

  private getCostCategoryValueOptions(): ToolbarChipGroup[] {
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
              key: val,
              name: val, // tag key values not localized
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

  private onCostCategoryValueToggle = isOpen => {
    this.setState({
      isCostCategoryValueExpanded: isOpen,
    });
  };

  private updateReport = () => {
    const { fetchResource, resourceQueryString, resourcePathsType } = this.props;
    fetchResource(resourcePathsType, resourceType, resourceQueryString);
  };

  public render() {
    const { intl, isDisabled, onCostCategoryValueInput, onCostCategoryValueSelect, selections, costCategoryKeyValue } =
      this.props;
    const { isCostCategoryValueExpanded } = this.state;

    const selectOptions = this.getCostCategoryValueOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    if (selectOptions.length > 0 && selectOptions.length < costCategoryKeyValueLimit) {
      return (
        <Select
          isDisabled={isDisabled}
          variant={SelectVariant.checkbox}
          aria-label={intl.formatMessage(messages.filterByCostCategoryValueAriaLabel)}
          onSelect={onCostCategoryValueSelect}
          onToggle={(_evt, isExpanded) => this.onCostCategoryValueToggle(isExpanded)}
          selections={selections}
          isOpen={isCostCategoryValueExpanded}
          placeholderText={intl.formatMessage(messages.chooseValuePlaceholder)}
        >
          {selectOptions}
        </Select>
      );
    }
    return (
      <InputGroup>
        <InputGroupItem isFill>
          <TextInput
            isDisabled={isDisabled}
            name="tag-key-value-input"
            id="tag-key-value-input"
            type="search"
            aria-label={intl.formatMessage(messages.filterByCostCategoryValueAriaLabel)}
            onChange={(_evt, value) => this.onCostCategoryValueChange(value)}
            value={costCategoryKeyValue}
            placeholder={intl.formatMessage(messages.filterByValuePlaceholder)}
            onKeyDown={evt => onCostCategoryValueInput(evt)}
          />
        </InputGroupItem>
        <InputGroupItem>
          <Button
            isDisabled={isDisabled}
            variant={ButtonVariant.control}
            aria-label={intl.formatMessage(messages.filterByCostCategoryValueButtonAriaLabel)}
            onClick={evt => onCostCategoryValueInput(evt)}
          >
            <SearchIcon />
          </Button>
        </InputGroupItem>
      </InputGroup>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostCategoryValueOwnProps, CostCategoryValueStateProps>(
  (state, { router, costCategoryKey, resourcePathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

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
