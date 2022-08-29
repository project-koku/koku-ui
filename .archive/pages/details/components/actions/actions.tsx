import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import { ExportModal } from 'routes/details/components/export/exportModal';
import { HistoricalModal } from 'routes/details/components/historicalData/historicalModal';
import { PriceListModal } from 'routes/details/components/priceList/priceListModal';
import { SummaryModal } from 'routes/details/components/summary/summaryModal';
import { TagModal } from 'routes/details/components/tag/tagModal';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface DetailsActionsOwnProps {
  groupBy: string;
  historicalChartComponent?: React.ReactElement<any>; // Override the default historical chart
  idKey: string; // 'account', 'project', 'subscription_guid', etc.
  isSummaryOptionDisabled: boolean;
  isTagOptionDisabled: boolean;
  item: ComputedReportItem;
  query: Query;
  reportPathsType: ReportPathsType;
  showPriceListOption?: boolean;
}

interface DetailsActionsState {
  isDropdownOpen: boolean;
  isExportModalOpen: boolean;
  isHistoricalModalOpen: boolean;
  isPriceListModalOpen: boolean;
  isTagModalOpen: boolean;
  isSummaryModalOpen: boolean;
}

type DetailsActionsProps = DetailsActionsOwnProps & InjectedTranslateProps;

class DetailsActionsBase extends React.Component<DetailsActionsProps> {
  protected defaultState: DetailsActionsState = {
    isDropdownOpen: false,
    isExportModalOpen: false,
    isHistoricalModalOpen: false,
    isPriceListModalOpen: false,
    isTagModalOpen: false,
    isSummaryModalOpen: false,
  };
  public state: DetailsActionsState = { ...this.defaultState };

  constructor(props: DetailsActionsProps) {
    super(props);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handleHistoricalModalClose = this.handleHistoricalModalClose.bind(
      this
    );
    this.handleHistoricalModalOpen = this.handleHistoricalModalOpen.bind(this);
    this.handlePriceListModalClose = this.handlePriceListModalClose.bind(this);
    this.handlePriceListModalOpen = this.handlePriceListModalOpen.bind(this);
    this.handleTagModalClose = this.handleTagModalClose.bind(this);
    this.handleTagModalOpen = this.handleTagModalOpen.bind(this);
    this.handleSummaryModalClose = this.handleSummaryModalClose.bind(this);
    this.handleSummaryModalOpen = this.handleSummaryModalOpen.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  private getExportModal = () => {
    const { groupBy, item, query, reportPathsType } = this.props;
    const { isExportModalOpen } = this.state;

    return (
      <ExportModal
        groupBy={groupBy}
        isOpen={isExportModalOpen}
        items={[item]}
        onClose={this.handleExportModalClose}
        query={query}
        reportPathsType={reportPathsType}
      />
    );
  };

  private getHistoricalModal = () => {
    const {
      groupBy,
      historicalChartComponent,
      item,
      reportPathsType,
    } = this.props;
    const { isHistoricalModalOpen } = this.state;

    return (
      <HistoricalModal
        chartComponent={historicalChartComponent}
        filterBy={item.label || item.id}
        groupBy={groupBy}
        isOpen={isHistoricalModalOpen}
        onClose={this.handleHistoricalModalClose}
        reportPathsType={reportPathsType}
      />
    );
  };

  private getPriceListModal = () => {
    const {
      item: { label },
    } = this.props;
    return (
      <PriceListModal
        name={label}
        isOpen={this.state.isPriceListModalOpen}
        close={this.handlePriceListModalClose}
      />
    );
  };

  private getTagModal = () => {
    const { groupBy, item, reportPathsType } = this.props;
    const { isTagModalOpen } = this.state;

    return (
      <TagModal
        filterBy={item.label || item.id}
        groupBy={groupBy}
        isOpen={isTagModalOpen}
        onClose={this.handleTagModalClose}
        reportPathsType={reportPathsType}
      />
    );
  };

  private getSummaryModal = () => {
    const { groupBy, idKey, item, reportPathsType } = this.props;
    const { isSummaryModalOpen } = this.state;

    return (
      <SummaryModal
        filterBy={item.label || item.id}
        groupBy={idKey}
        isOpen={isSummaryModalOpen}
        onClose={this.handleSummaryModalClose}
        parentGroupBy={groupBy}
        reportPathsType={reportPathsType}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  public handleHistoricalModalClose = (isOpen: boolean) => {
    this.setState({ isHistoricalModalOpen: isOpen });
  };

  public handleHistoricalModalOpen = () => {
    this.setState({ isHistoricalModalOpen: true });
  };

  public handlePriceListModalClose = (isOpen: boolean) => {
    this.setState({ isPriceListModalOpen: isOpen });
  };

  public handlePriceListModalOpen = () => {
    this.setState({ isPriceListModalOpen: true });
  };

  public handleTagModalClose = (isOpen: boolean) => {
    this.setState({ isTagModalOpen: isOpen });
  };

  public handleTagModalOpen = () => {
    this.setState({ isTagModalOpen: true });
  };

  public handleSummaryModalClose = (isOpen: boolean) => {
    this.setState({ isSummaryModalOpen: isOpen });
  };

  public handleSummaryModalOpen = () => {
    this.setState({ isSummaryModalOpen: true });
  };

  public handleOnSelect = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
  };

  public handleOnToggle = (isDropdownOpen: boolean) => {
    this.setState({ isDropdownOpen });
  };

  public render() {
    const {
      groupBy,
      idKey,
      isSummaryOptionDisabled,
      isTagOptionDisabled,
      showPriceListOption,
      t,
    } = this.props;

    // tslint:disable:jsx-wrap-multiline
    const items = [
      <DropdownItem
        component="button"
        key="historical-data-action"
        onClick={this.handleHistoricalModalOpen}
      >
        {t('details.actions.historical_data')}
      </DropdownItem>,
      <DropdownItem
        component="button"
        key="summary-action"
        isDisabled={isSummaryOptionDisabled}
        onClick={this.handleSummaryModalOpen}
      >
        {t(`details.actions.${idKey}`)}
      </DropdownItem>,
      <DropdownItem
        component="button"
        key="tag-action"
        isDisabled={isTagOptionDisabled}
        onClick={this.handleTagModalOpen}
      >
        {t('details.actions.tags')}
      </DropdownItem>,
      <DropdownItem
        component="button"
        key="export-action"
        onClick={this.handleExportModalOpen}
      >
        {t('details.actions.export')}
      </DropdownItem>,
    ];
    // tslint:enable:jsx-wrap-multiline

    if (showPriceListOption) {
      items.unshift(
        <DropdownItem
          component="button"
          key="price-list-action"
          isDisabled={groupBy.includes(tagKeyPrefix)}
          onClick={this.handlePriceListModalOpen}
        >
          {t('details.actions.price_list')}
        </DropdownItem>
      );
    }

    return (
      <>
        <Dropdown
          onSelect={this.handleOnSelect}
          toggle={<KebabToggle onToggle={this.handleOnToggle} />}
          isOpen={this.state.isDropdownOpen}
          isPlain
          position="right"
          dropdownItems={items}
        />
        {this.getExportModal()}
        {this.getHistoricalModal()}
        {this.getTagModal()}
        {this.getSummaryModal()}
        {showPriceListOption && this.getPriceListModal()}
      </>
    );
  }
}

const Actions = translate()(DetailsActionsBase);

export { Actions };
