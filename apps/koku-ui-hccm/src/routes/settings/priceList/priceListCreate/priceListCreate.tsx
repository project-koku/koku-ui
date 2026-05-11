import { Divider, PageSection, Stack, StackItem } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { Rate } from 'api/rates';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { LoadingState } from 'routes/components/state/loadingState';
import type { DetailsContentHandle } from 'routes/settings/priceList/priceList/details';
import { DetailsContent } from 'routes/settings/priceList/priceList/details';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { formatPath } from 'utils/paths';
import { hasSettingsAccess } from 'utils/userAccess';

import { styles } from './priceListCreate.styles';
import { PriceListCreateHeader } from './priceListCreateHeader';
import { PriceListRates } from './priceListRates';

interface PriceListCreateOwnProps {
  // TBD...
}

interface PriceListCreateStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PriceListCreateProps = PriceListCreateOwnProps;

const PriceListCreate: React.FC<PriceListCreateProps> = () => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const contentRef = useRef<DetailsContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [priceList, setPriceList] = useState<PriceListData>({});
  const [rates, setRates] = useState<Rate[]>([]);

  const { priceListUpdateStatus, priceListUpdateError, userAccess, userAccessFetchStatus } = useMapToProps();

  const canWrite = () => {
    return hasSettingsAccess(userAccess);
  };

  // Handlers

  const handleOnCancel = () => {
    navigateToPriceListDetails();
  };

  const handleOnSave = (payload: PriceListData) => {
    setIsFinish(true);

    // Update rates with latest currency
    const newRates = rates?.map(rate => ({
      ...rate,
      ...(rate?.tag_rates && {
        tag_rates: {
          ...rate?.tag_rates,
          tag_values: rate?.tag_rates?.tag_values.map(tagValue => ({
            ...tagValue,
            unit: payload?.currency,
          })),
        },
      }),
      ...(rate?.tiered_rates && {
        tiered_rates: rate?.tiered_rates?.map(tieredRate => ({
          ...tieredRate,
          unit: payload?.currency,
        })),
      }),
    }));

    dispatch(
      priceListActions.updatePriceList(PriceListType.priceListAdd, undefined, {
        ...(priceList ?? {}),
        ...(payload ?? {}),
        ...(newRates && { rates: newRates }),
      })
    );
  };

  const navigateToPriceListDetails = () => {
    navigate(formatPath(routes.settings.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
        settingsState: {
          activeTabKey: 1,
        },
      },
    });
  };

  // Effects

  useEffect(() => {
    setPriceList({
      ...(priceList ?? {}),
      rates,
    });
  }, [rates]);

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      navigateToPriceListDetails();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <PriceListCreateHeader
            canWrite={canWrite()}
            isDisabled={isDisabled}
            onCancel={handleOnCancel}
            onCreate={() => contentRef.current?.save()}
            priceList={priceList}
          />
          {userAccessFetchStatus === FetchStatus.inProgress && <LoadingState />}
        </header>
      </PageSection>
      <PageSection>
        <Stack hasGutter>
          <StackItem style={styles.detailsContent}>
            <DetailsContent onDisabled={setIsDisabled} onSave={handleOnSave} priceList={priceList} ref={contentRef} />
          </StackItem>
          <StackItem style={styles.divider}>
            <Divider />
          </StackItem>
          <StackItem>
            <PriceListRates
              canWrite={canWrite()}
              onAdd={setRates}
              onDelete={setRates}
              onEdit={setRates}
              priceList={priceList}
            />
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

const useMapToProps = (): PriceListCreateStateProps => {
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListAdd, undefined)
  );
  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListAdd, undefined)
  );

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessError = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessFetchStatus = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessFetchStatus(state, UserAccessType.all, userAccessQueryString)
  );

  return {
    priceListUpdateError,
    priceListUpdateStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
};

export default PriceListCreate;
