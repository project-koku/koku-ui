import { PageSection, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import { AccountSettingsType } from 'api/accountSettings';
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
import type { FetchStatus } from 'store/common';
import { getAccountCostType, getAccountCurrency } from 'utils/sessionStorage';

import { styles } from './calculations.styles';

interface CalculationsPropsOwnProps {
  canWrite?: boolean;
}

export interface CalculationsStateProps {
  costTypeAccountSettingsUpdateStatus: FetchStatus;
  currencyAccountSettingsUpdateStatus: FetchStatus;
}

type CalculationsProps = CalculationsPropsOwnProps;

const Calculations: React.FC<CalculationsProps> = ({ canWrite }) => {
  const [costType, setCostType] = useState(getAccountCostType());
  const [currency, setCurrency] = useState(getAccountCostType());

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const { costTypeAccountSettingsUpdateStatus, currencyAccountSettingsUpdateStatus } = useMapToProps();

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
      <div style={styles.currencyContainer}>
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
      </div>
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
    setCostType(getAccountCostType());
    setCurrency(getAccountCurrency());
  }, [costTypeAccountSettingsUpdateStatus, currencyAccountSettingsUpdateStatus]);

  return (
    <PageSection isFilled>
      {getCurrency()}
      {getCostType()}
    </PageSection>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): CalculationsStateProps => {
  const costTypeAccountSettingsUpdateStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateStatus(state, AccountSettingsType.costType)
  );
  const currencyAccountSettingsUpdateStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateStatus(state, AccountSettingsType.currency)
  );

  return {
    costTypeAccountSettingsUpdateStatus,
    currencyAccountSettingsUpdateStatus,
  };
};

export default Calculations;
