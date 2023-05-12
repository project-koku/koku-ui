import messages from 'locales/messages';
import React from 'react';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';

// Infrastructure AWS options
const infrastructureAwsOptions = [{ label: messages.perspectiveValues, value: 'aws' }];

// Infrastructure AWS filtered by OpenShift options
const infrastructureAwsOcpOptions = [{ label: messages.perspectiveValues, value: 'aws_ocp' }];

// Infrastructure Azure options
const infrastructureAzureOptions = [{ label: messages.perspectiveValues, value: 'azure' }];

// Infrastructure Oci options
const infrastructureOciOptions = [{ label: messages.perspectiveValues, value: 'oci' }];

// Infrastructure Azure filtered by OpenShift options
const infrastructureAzureOcpOptions = [{ label: messages.perspectiveValues, value: 'azure_ocp' }];

// Infrastructure GCP options
const infrastructureGcpOptions = [{ label: messages.perspectiveValues, value: 'gcp' }];

// Infrastructure GCP filtered by OCP options
const infrastructureGcpOcpOptions = [{ label: messages.perspectiveValues, value: 'gcp_ocp' }];

// Infrastructure IBM options
const infrastructureIbmOptions = [{ label: messages.perspectiveValues, value: 'ibm' }];

// Infrastructure IBM filtered by OCP options
const infrastructureIbmOcpOptions = [{ label: messages.perspectiveValues, value: 'ibm_ocp' }];

// Infrastructure Ocp cloud options
const infrastructureOcpCloudOptions = [{ label: messages.perspectiveValues, value: 'ocp_cloud' }];

// Ocp options
const ocpOptions = [{ label: messages.perspectiveValues, value: 'ocp' }];

// RHEL options
const rhelOptions = [{ label: messages.perspectiveValues, value: 'rhel' }];

interface PerspectiveProps {
  currentItem?: string;
  hasAws?: boolean;
  hasAwsOcp?: boolean;
  hasAzure?: boolean;
  hasAzureOcp?: boolean;
  hasGcp?: boolean;
  hasGcpOcp?: boolean;
  hasIbm?: boolean;
  hasIbmOcp?: boolean;
  hasOci?: boolean;
  hasOcp?: boolean;
  hasOcpCloud?: boolean;
  hasRhel?: boolean;
  isDisabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
  isInfrastructureTab?: boolean; // Used by the overview page
  isRhelTab?: boolean; // Used by the overview page,
  onSelected?: (value: string) => void;
}

const getInfrastructureOptions = ({
  hasAws,
  hasAwsOcp,
  hasAzure,
  hasAzureOcp,
  hasGcp,
  hasGcpOcp,
  hasIbm,
  hasIbmOcp,
  hasOci,
  isIbmFeatureEnabled,
}) => {
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
  if (hasIbm) {
    options.push(...infrastructureIbmOptions);
  }
  if (hasIbmOcp && isIbmFeatureEnabled) {
    options.push(...infrastructureIbmOcpOptions);
  }
  if (hasAzure) {
    options.push(...infrastructureAzureOptions);
  }
  if (hasAzureOcp) {
    options.push(...infrastructureAzureOcpOptions);
  }
  if (hasOci) {
    options.push(...infrastructureOciOptions);
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
  hasIbm,
  hasIbmOcp,
  hasOci,
  hasOcp,
  hasOcpCloud,
  hasRhel,
  isDisabled,
  isIbmFeatureEnabled,
  isInfrastructureTab,
  isRhelTab,
  onSelected,
}): any => {
  // Dynamically show options if providers are available
  const options = [];

  // Note isInfrastructureTab and isRhelTab will be undefined for cost explorer
  if (isInfrastructureTab !== undefined || isRhelTab !== undefined) {
    if (isInfrastructureTab) {
      if (hasOcpCloud) {
        options.push(...infrastructureOcpCloudOptions);
      }
      options.push(
        ...getInfrastructureOptions({
          hasAws,
          hasAwsOcp,
          hasAzure,
          hasAzureOcp,
          hasGcp,
          hasGcpOcp,
          hasIbm,
          hasIbmOcp,
          hasOci,
          isIbmFeatureEnabled,
        })
      );
    } else if (isRhelTab) {
      if (hasRhel) {
        options.push(...rhelOptions);
      }
    } else if (hasOcp) {
      options.push(...ocpOptions);
    }
  } else {
    if (hasOcp) {
      options.push(...ocpOptions);
    }
    if (hasOcpCloud) {
      options.push(...infrastructureOcpCloudOptions);
    }
    if (hasRhel) {
      options.push(...rhelOptions);
    }
    options.push(
      ...getInfrastructureOptions({
        hasAws,
        hasAwsOcp,
        hasAzure,
        hasAzureOcp,
        hasGcp,
        hasGcpOcp,
        hasIbm,
        hasIbmOcp,
        hasOci,
        isIbmFeatureEnabled,
      })
    );
  }

  return (
    <PerspectiveSelect
      currentItem={currentItem || options[0].value}
      isDisabled={isDisabled}
      onSelected={onSelected}
      options={options}
    />
  );
};

export default Perspective;
