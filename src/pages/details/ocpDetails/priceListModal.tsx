import { Modal } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { ProviderType } from 'api/providers';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { providersSelectors } from 'store/providers';
import { styles as chartStyles } from './historicalChart.styles';
import { modalOverride } from './historicalModal.styles';
import { NoRatesState } from './noRatesState';
import PriceListTable from './priceListTable';

interface Props extends InjectedTranslateProps {
  isOpen: boolean;
  close: (isOpen: boolean) => void;
  fetch: typeof priceListActions.fetchPriceList;
  providers: any;
  name: number | string;
  priceList: any;
  priceListError: AxiosError;
  priceListStatus: FetchStatus;
}

class PriceListModalBase extends React.Component<Props> {
  public componentDidUpdate() {
    const {
      fetch,
      isOpen,
      providers,
      priceListStatus: status,
      name,
    } = this.props;
    if (isOpen && status !== FetchStatus.inProgress) {
      const priceListProvider = providers.data.find(p => p.name === name);
      fetch(priceListProvider ? priceListProvider.uuid : null);
    }
  }

  public renderContent() {
    const {
      t,
      providers,
      name,
      priceListStatus,
      priceListError,
      priceList,
    } = this.props;

    if (priceListStatus !== FetchStatus.complete) {
      return (
        <Skeleton
          className={css(chartStyles.chartSkeleton)}
          size={SkeletonSize.md}
        />
      );
    }
    if (priceListError !== null) {
      return <ErrorState error={priceListError} />;
    }

    const priceListProvider = providers.data.find(p => p.name === name);
    const priceListRates =
      priceListProvider && priceList[priceListProvider.uuid];
    return priceListRates ? (
      <PriceListTable t={t} rates={priceListRates} />
    ) : (
      <NoRatesState cluster={name.toString()} />
    );
  }

  public render() {
    const { t, isOpen, close, name } = this.props;

    return (
      <Modal
        className={modalOverride}
        isOpen={isOpen}
        onClose={() => close(false)}
        title={t('ocp_details.price_list.modal.title', { name })}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

const PriceListModal = connect(
  createMapStateToProps((state, props: { name: string | number }) => {
    const providers = providersSelectors.selectProviders(
      state,
      ProviderType.ocp,
      'type=OCP'
    );
    const priceListProvider = providers.data.find(p => p.name === props.name);
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
)(translate()(PriceListModalBase));

export default PriceListModal;
