import { Card, CardBody, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import { AccountSettingsType } from 'api/accountSettings';
import { isSettingsDataRetentionPeriodEnabled, useIsOrgAdmin } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import { DataRetention } from 'routes/settings/components/dataRetention';
import { useAccountSettingsNotifications } from 'routes/settings/utils/hooks';
import type { RootState } from 'store';
import { accountSettingsActions } from 'store/accountSettings';
import { getAccountCostType, getAccountCurrency } from 'utils/sessionStorage';

import { styles } from './display.styles';

interface DisplayOwnProps {
  canWrite?: boolean;
}

export interface DisplayMapProps {
  setCostType: (value: string) => void;
  setCurrency: (value: string) => void;
}

export interface DisplayStateProps {
  // TBD...
}

type DisplayProps = DisplayOwnProps;

const Display: React.FC<DisplayProps> = ({ canWrite }) => {
  const isOrgAdmin = useIsOrgAdmin();

  const [costType, setCostType] = useState(getAccountCostType());
  const [currency, setCurrency] = useState(getAccountCurrency());

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  useMapToProps({ setCostType, setCurrency });

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
              onSelect={handleOnCostType}
              showLabel={false}
            />
          )}
        </div>
      </div>
    );
  };

  const getCurrency = () => {
    // Todo: Add description with constant currencies feature
    // <p>{intl.formatMessage(messages.displayCurrencyDesc)}</p>

    return (
      <>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.displayCurrency)}
        </Title>
        {intl.formatMessage(messages.currencyDesc)}
        <div style={styles.currency}>
          {getTooltip(
            <Currency
              currency={currency}
              isDisabled={!canWrite}
              isSessionStorage={false}
              onSelect={handleOnCurrency}
              showLabel={false}
            />
          )}
        </div>
      </>
    );
  };

  const getDataRetention = () => {
    if (!isSettingsDataRetentionPeriodEnabled) {
      return null;
    }
    return (
      <div style={styles.dataRetentionContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.dataRetentionPeriod)}
        </Title>
        {intl.formatMessage(messages.dataRetentionPeriodDesc)}
        <div style={styles.dataRetention}>
          <DataRetention isDisabled={!isOrgAdmin} />
        </div>
      </div>
    );
  };

  const getTooltip = (comp: React.ReactElement) => {
    return !canWrite ? <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{comp}</Tooltip> : comp;
  };

  const handleOnCostType = (value: string) => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.costType, {
        cost_type: value,
      })
    );
  };

  const handleOnCurrency = (value: string) => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.currency, {
        currency: value,
      })
    );
  };

  return (
    <Card>
      <CardBody>
        {getCurrency()}
        {getDataRetention()}
        {getCostType()}
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({ setCostType, setCurrency }: DisplayMapProps): DisplayStateProps => {
  // Notifications
  useAccountSettingsNotifications({
    getSessionValue: getAccountCostType,
    type: AccountSettingsType.costType,
    setState: setCostType,
  });

  useAccountSettingsNotifications({
    getSessionValue: getAccountCurrency,
    type: AccountSettingsType.currency,
    setState: setCurrency,
  });

  return {
    // TBD...
  };
};

export { Display };
