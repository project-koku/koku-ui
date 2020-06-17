import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { ProviderType } from 'api/providers';
import { Query } from 'api/queries/query';
import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import { ExportModal } from 'pages/details/components/export/exportModal';
import { PriceListModal } from 'pages/details/components/priceList/priceListModal';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface DetailsActionsOwnProps {
  groupBy: string;
  item: ComputedReportItem;
  providerType?: ProviderType;
  query: Query;
  reportPathsType: ReportPathsType;
  showPriceListOption?: boolean;
}

interface DetailsActionsState {
  isDropdownOpen: boolean;
  isExportModalOpen: boolean;
  isPriceListModalOpen: boolean;
}

type DetailsActionsProps = DetailsActionsOwnProps & InjectedTranslateProps;

class DetailsActionsBase extends React.Component<DetailsActionsProps> {
  protected defaultState: DetailsActionsState = {
    isDropdownOpen: false,
    isExportModalOpen: false,
    isPriceListModalOpen: false,
  };
  public state: DetailsActionsState = { ...this.defaultState };

  constructor(props: DetailsActionsProps) {
    super(props);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handlePriceListModalClose = this.handlePriceListModalClose.bind(this);
    this.handlePriceListModalOpen = this.handlePriceListModalOpen.bind(this);
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

  private getPriceListModal = () => {
    const { item, providerType } = this.props;
    return (
      <PriceListModal
        close={this.handlePriceListModalClose}
        isOpen={this.state.isPriceListModalOpen}
        item={item}
        providerType={providerType}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  public handlePriceListModalClose = (isOpen: boolean) => {
    this.setState({ isPriceListModalOpen: isOpen });
  };

  public handlePriceListModalOpen = () => {
    this.setState({ isPriceListModalOpen: true });
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
    const { groupBy, showPriceListOption, t } = this.props;

    // tslint:disable:jsx-wrap-multiline
    const items = [
      <DropdownItem
        component="button"
        key="export-action"
        onClick={this.handleExportModalOpen}
      >
        {t('details.actions.export')}
      </DropdownItem>,
    ];

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
        {showPriceListOption && this.getPriceListModal()}
      </>
    );
  }
}

const Actions = translate()(DetailsActionsBase);

export { Actions };
