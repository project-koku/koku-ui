import { isOnPremEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';

// Infrastructure AWS options
const infrastructureAwsOptions = [{ label: messages.perspectiveValues, value: 'aws' }];

// Infrastructure AWS filtered by OpenShift options
const infrastructureAwsOcpOptions = [{ label: messages.perspectiveValues, value: 'aws_ocp' }];

// Infrastructure Azure options
const infrastructureAzureOptions = [{ label: messages.perspectiveValues, value: 'azure' }];

// Infrastructure Azure filtered by OpenShift options
const infrastructureAzureOcpOptions = [{ label: messages.perspectiveValues, value: 'azure_ocp' }];

// Infrastructure GCP options
const infrastructureGcpOptions = [{ label: messages.perspectiveValues, value: 'gcp' }];

// Infrastructure GCP filtered by OCP options
const infrastructureGcpOcpOptions = [{ label: messages.perspectiveValues, value: 'gcp_ocp' }];

// Infrastructure Ocp cloud options
const infrastructureOcpCloudOptions = [{ label: messages.perspectiveValues, value: 'ocp_cloud' }];

// Ocp options
const ocpOptions = [{ label: messages.perspectiveValues, value: 'ocp' }];

interface PerspectiveProps {
  currentItem?: string;
  hasAws?: boolean;
  hasAwsOcp?: boolean;
  hasAzure?: boolean;
  hasAzureOcp?: boolean;
  hasGcp?: boolean;
  hasGcpOcp?: boolean;
  hasOcp?: boolean;
  hasOcpCloud?: boolean;
  isDisabled?: boolean;
  isInfrastructureTab?: boolean; // Used by the overview page
  onSelect?: (value: string) => void;
}

const getInfrastructureOptions = ({ hasAws, hasAwsOcp, hasAzure, hasAzureOcp, hasGcp, hasGcpOcp }) => {
  const options = [];

  if (hasAws) {
    options.push(...infrastructureAwsOptions);
  }
  if (hasAwsOcp) {
    options.push(...infrastructureAwsOcpOptions);
  }
  if (hasGcp) {
    options.push(...infrastructureGcpOptions);
  }
  if (hasGcpOcp) {
    options.push(...infrastructureGcpOcpOptions);
  }
  if (hasAzure) {
    options.push(...infrastructureAzureOptions);
  }
  if (hasAzureOcp) {
    options.push(...infrastructureAzureOcpOptions);
  }
  return options;
};

const Perspective: React.FC<PerspectiveProps> = ({
  currentItem,
  hasAws,
  hasAwsOcp,
  hasAzure,
  hasAzureOcp,
  hasGcp,
  hasGcpOcp,
  hasOcp,
  hasOcpCloud,
  isDisabled,
  isInfrastructureTab,
  onSelect,
}): any => {
  // Dynamically show options if providers are available
  const options = [];

  if (isInfrastructureTab !== undefined) {
    if (isInfrastructureTab) {
      if (hasOcpCloud && !isOnPremEnabled) {
        options.push(...infrastructureOcpCloudOptions);
      }
      options.push(
        ...getInfrastructureOptions({
          hasAws: hasAws && !isOnPremEnabled,
          hasAwsOcp: hasAwsOcp && !isOnPremEnabled,
          hasAzure: hasAzure && !isOnPremEnabled,
          hasAzureOcp: hasAzureOcp && !isOnPremEnabled,
          hasGcp: hasGcp && !isOnPremEnabled,
          hasGcpOcp: hasGcpOcp && !isOnPremEnabled,
        })
      );
    } else if (hasOcp) {
      options.push(...ocpOptions);
    }
  } else {
    if (hasOcp) {
      options.push(...ocpOptions);
    }
    if (hasOcpCloud && !isOnPremEnabled) {
      options.push(...infrastructureOcpCloudOptions);
    }
    options.push(
      ...getInfrastructureOptions({
        hasAws: hasAws && !isOnPremEnabled,
        hasAwsOcp: hasAwsOcp && !isOnPremEnabled,
        hasAzure: hasAzure && !isOnPremEnabled,
        hasAzureOcp: hasAzureOcp && !isOnPremEnabled,
        hasGcp: hasGcp && !isOnPremEnabled,
        hasGcpOcp: hasGcpOcp && !isOnPremEnabled,
      })
    );
  }

  return (
    <PerspectiveSelect
      currentItem={currentItem || options[0].value}
      isDisabled={isDisabled}
      onSelect={onSelect}
      options={options}
    />
  );
};

export default Perspective;
