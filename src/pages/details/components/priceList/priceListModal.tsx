import './priceListModal.scss';

import { Modal } from '@patternfly/react-core';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { ProviderType } from 'api/providers';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { providersSelectors } from 'store/providers';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import { NoRatesState } from './noRatesState';
import { styles } from './priceListModal.styles';
import PriceListTable from './priceListTable';

interface Props extends WithTranslation {
  close: (isOpen: boolean) => void;
  fetch: typeof priceListActions.fetchPriceList;
  isOpen: boolean;
  item: ComputedReportItem;
  priceList: any;
  priceListError: AxiosError;
  priceListStatus: FetchStatus;
  providers: any;
  providerType: ProviderType;
}

// Prune null values
const getSourceUUID = (item: ComputedReportItem) => {
  for (const uuid of item.source_uuid) {
    if (uuid !== null) {
      return uuid;
    }
  }
  return '';
};

class PriceListModalBase extends React.Component<Props> {
  public componentDidUpdate() {
    const { fetch, isOpen, item, providers, priceListStatus: status } = this.props;
    if (isOpen && status !== FetchStatus.inProgress) {
      const priceListProvider = providers.data.find(p => p.uuid === getSourceUUID(item));
      fetch(priceListProvider ? priceListProvider.uuid : null);
    }
  }

  public renderContent() {
    const { item, priceListStatus, priceListError, priceList, providers, t } = this.props;

    if (priceListStatus !== FetchStatus.complete) {
      return <Skeleton style={styles.skeleton} size="md" />;
    }
    if (priceListError !== null) {
      return <ErrorState error={priceListError} />;
    }

    const priceListProvider = providers.data.find(p => p.uuid === getSourceUUID(item));
    const priceListRates = priceListProvider && priceList[priceListProvider.uuid];
    return priceListRates ? (
      <PriceListTable t={t} rates={priceListRates} />
    ) : (
      <NoRatesState cluster={item.label.toString()} />
    );
  }

  public render() {
    const { t, isOpen, close, item } = this.props;

    return (
      <Modal
        className="modalOverride"
        isOpen={isOpen}
        onClose={() => close(false)}
        title={t('details.price_list.modal.title', { name: item.label })}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

const PriceListModal = connect(
  createMapStateToProps((state, { item, providerType }) => {
    let type;
    switch (providerType) {
      case ProviderType.aws:
        type = 'AWS';
        break;
      case ProviderType.azure:
        type = 'AZURE';
        break;
      case ProviderType.ocp:
        type = 'OCP';
        break;
    }
    const providers = providersSelectors.selectProviders(state, providerType, `type=${type}`);
    const priceListProvider =
      providers && providers.data ? providers.data.find(p => p.uuid === getSourceUUID(item)) : undefined;
    const providerUuid = priceListProvider ? priceListProvider.uuid : null;
    return {
      priceList: priceListSelectors.ratesPerProvider(state, providerUuid),
      priceListError: priceListSelectors.error(state, providerUuid),
      priceListStatus: priceListSelectors.status(state, providerUuid),
      providers,
    };
  }),
  {
    fetch: priceListActions.fetchPriceList,
  }
)(withTranslation()(PriceListModalBase));

export { PriceListModal };
