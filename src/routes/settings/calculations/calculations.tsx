import { Card, CardBody, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { AccountSettingsType } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import type { RootState } from 'store';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { FetchStatus } from 'store/common';
import { resetStatus } from 'store/settings/settingsActions';
import { getAccountCostType, getAccountCurrency } from 'utils/sessionStorage';

import { styles } from './calculations.styles';

interface CalculationsPropsOwnProps {
  canWrite?: boolean;
}

export interface CalculationsStateProps {
  costTypeAccountSettingsUpdateError: AxiosError;
  costTypeAccountSettingsUpdateNotification?: any;
  costTypeAccountSettingsUpdateStatus: FetchStatus;
  currencyAccountSettingsUpdateError: AxiosError;
  currencyAccountSettingsUpdateNotification?: any;
  currencyAccountSettingsUpdateStatus: FetchStatus;
}

type CalculationsProps = CalculationsPropsOwnProps;

const Calculations: React.FC<CalculationsProps> = ({ canWrite }) => {
  const [costType, setCostType] = useState(getAccountCostType());
  const [currency, setCurrency] = useState(getAccountCurrency());

  const addNotification = useAddNotification();
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const {
    costTypeAccountSettingsUpdateError,
    costTypeAccountSettingsUpdateNotification,
    costTypeAccountSettingsUpdateStatus,
    currencyAccountSettingsUpdateError,
    currencyAccountSettingsUpdateNotification,
    currencyAccountSettingsUpdateStatus,
  } = useMapToProps();

  const getCostType = () => {
    return (
      <div style={styles.costTypeContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.costTypeSettingsLabel)}
        </Title>
        {intl.formatMessage(messages.costTypeSettingsDesc)}
        <div style={styles.costType}>
          {getTooltip(
            <CostType
              costType={costType}
              isDisabled={!canWrite}
              isSessionStorage={false}
              onSelect={handleOnCostTypeSelected}
              showLabel={false}
            />
          )}
        </div>
      </div>
    );
  };

  const getCurrency = () => {
    return (
      <>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.currency)}
        </Title>
        {intl.formatMessage(messages.currencyDesc)}
        <div style={styles.currency}>
          {getTooltip(
            <Currency
              currency={currency}
              isDisabled={!canWrite}
              isSessionStorage={false}
              onSelect={handleOnCurrencySelected}
              showLabel={false}
            />
          )}
        </div>
      </>
    );
  };

  const getTooltip = comp => {
    return !canWrite ? <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{comp}</Tooltip> : comp;
  };

  const handleOnCostTypeSelected = value => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.costType, {
        cost_type: value,
      })
    );
  };

  const handleOnCurrencySelected = value => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.currency, {
        currency: value,
      })
    );
  };

  useEffect(() => {
    if (
      costTypeAccountSettingsUpdateNotification &&
      (costTypeAccountSettingsUpdateStatus === FetchStatus.complete || costTypeAccountSettingsUpdateError)
    ) {
      if (!costTypeAccountSettingsUpdateError) {
        setCostType(getAccountCostType());
      }
      addNotification(costTypeAccountSettingsUpdateNotification);
      dispatch(resetStatus());
    }
  }, [
    costTypeAccountSettingsUpdateError,
    costTypeAccountSettingsUpdateNotification,
    costTypeAccountSettingsUpdateStatus,
  ]);

  useEffect(() => {
    if (
      currencyAccountSettingsUpdateNotification &&
      (currencyAccountSettingsUpdateStatus === FetchStatus.complete || currencyAccountSettingsUpdateError)
    ) {
      if (!currencyAccountSettingsUpdateError) {
        setCurrency(getAccountCurrency());
      }
      addNotification(currencyAccountSettingsUpdateNotification);
      dispatch(resetStatus());
    }
  }, [
    currencyAccountSettingsUpdateError,
    currencyAccountSettingsUpdateNotification,
    currencyAccountSettingsUpdateStatus,
  ]);

  return (
    <Card>
      <CardBody>
        {getCurrency()}
        {getCostType()}
      </CardBody>
    </Card>
  );
};

const useMapToProps = (): CalculationsStateProps => {
  const costTypeAccountSettingsUpdateError = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateError(state, AccountSettingsType.costType)
  );
  const costTypeAccountSettingsUpdateNotification = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateNotification(state, AccountSettingsType.costType)
  );
  const costTypeAccountSettingsUpdateStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateStatus(state, AccountSettingsType.costType)
  );

  const currencyAccountSettingsUpdateError = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateError(state, AccountSettingsType.currency)
  );
  const currencyAccountSettingsUpdateNotification = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateNotification(state, AccountSettingsType.currency)
  );
  const currencyAccountSettingsUpdateStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateStatus(state, AccountSettingsType.currency)
  );

  return {
    costTypeAccountSettingsUpdateError,
    costTypeAccountSettingsUpdateNotification,
    costTypeAccountSettingsUpdateStatus,
    currencyAccountSettingsUpdateError,
    currencyAccountSettingsUpdateNotification,
    currencyAccountSettingsUpdateStatus,
  };
};

export default Calculations;
