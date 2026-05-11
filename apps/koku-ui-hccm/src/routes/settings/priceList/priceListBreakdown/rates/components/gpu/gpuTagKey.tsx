import type { MetricHash } from 'api/metrics';
import { getQuery } from 'api/queries/query';
import { type Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { Selector } from 'routes/settings/components';
import { hasDuplicateTagRates } from 'routes/settings/priceList/priceListBreakdown/rates/components/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';

interface GpuTagKeyOwnProps {
  costType?: string;
  error?: MessageDescriptor;
  invalid?: boolean;
  metric?: string;
  measurement?: string;
  metricsHashByName?: MetricHash;
  onChange?: (value: string) => void;
  rates?: any[];
  tagKey?: string;
}

export interface GpuTagKeyStateProps {
  resource: Resource;
  resourceError: AxiosError;
  resourceFetchStatus: FetchStatus;
}

export interface GpuTagKeyMapProps {
  // TBD...
}

type GpuTagKeyProps = GpuTagKeyOwnProps;

const GpuTagKey: React.FC<GpuTagKeyProps> = ({
  costType,
  error,
  invalid,
  metric,
  measurement,
  metricsHashByName,
  onChange,
  rates,
  tagKey,
}) => {
  const intl = useIntl();

  // Fetch GPU models
  const { resource } = useMapToProps();

  const getVendorOptions = () => {
    if (!resource?.data?.length) {
      return [];
    }
    return resource?.data?.map((option: any) => {
      // Vendor selection must be unique for a given metric/measurement/cost type
      const duplicateTag = rates?.find(item => {
        const metricName = item?.metric?.name ?? undefined;
        return hasDuplicateTagRates(
          {
            costType,
            measurement,
            metric,
            tagKey: option.value,
          },
          {
            costType: item?.cost_type,
            measurement: item.metric.name,
            metric: metricsHashByName?.[metricName]?.label_metric ?? undefined, // Todo: Replace with label_metric when available in price-lists API
            tagKey: item?.tag_rates?.tag_key,
          }
        );
      });
      const isDisabled = duplicateTag !== undefined;
      return {
        ...(isDisabled && { description: intl.formatMessage(messages.gpuVendorDuplicate) }),
        isDisabled,
        toString: () => option.value,
        value: option.value,
      };
    });
  };

  return (
    <Selector
      helperTextInvalid={error}
      id="gpu-tag-key"
      isDisabled={!measurement}
      isInvalid={invalid}
      isRequired
      label={intl.formatMessage(messages.costModelsGpuVendor)}
      options={getVendorOptions()}
      onSelect={(_evt, value) => onChange(value)}
      placeholderText={intl.formatMessage(messages.select)}
      toggleAriaLabel={intl.formatMessage(messages.costModelsGpuVendor)}
      value={tagKey}
    />
  );
};

const useMapToProps = (): GpuTagKeyStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery = {
    limit: 100,
  };
  const reportQueryString = getQuery(reportQuery);
  const resource = useSelector((state: RootState) =>
    resourceSelectors.selectResource(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );
  const resourceFetchStatus = useSelector((state: RootState) =>
    resourceSelectors.selectResourceFetchStatus(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );
  const resourceError = useSelector((state: RootState) =>
    resourceSelectors.selectResourceError(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );

  useEffect(() => {
    if (
      !resourceError &&
      resourceFetchStatus !== FetchStatus.inProgress &&
      resourceFetchStatus !== FetchStatus.complete
    ) {
      dispatch(resourceActions.fetchResource(ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString));
    }
  }, [reportQueryString, resourceError, resourceFetchStatus, ResourcePathsType.ocp, ResourceType.gpuVendor]);

  return {
    resource,
    resourceError,
    resourceFetchStatus,
  };
};

export { GpuTagKey };
