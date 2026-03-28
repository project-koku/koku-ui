import React from 'react';

const awsLogo = require('assets/logos/aws.svg') as string;
const azureLogo = require('assets/logos/azure.svg') as string;
const gcpLogo = require('assets/logos/gcp.svg') as string;
const openshiftLogo = require('assets/logos/openshift.svg') as string;

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

const DEFAULT_SIZE = 40;

const createLogoIcon = (src: string, alt: string): React.FC<IconProps> => {
  const LogoIcon: React.FC<IconProps> = ({ size = DEFAULT_SIZE, style, ...props }) => (
    <img src={src} alt={alt} width={size} height={size} style={{ objectFit: 'contain', ...style }} {...props} />
  );
  LogoIcon.displayName = `${alt.replace(/\s+/g, '')}Icon`;
  return LogoIcon;
};

export const OpenShiftIcon = createLogoIcon(openshiftLogo, 'Red Hat OpenShift');
export const AwsIcon = createLogoIcon(awsLogo, 'Amazon Web Services');
export const AzureIcon = createLogoIcon(azureLogo, 'Microsoft Azure');
export const GcpIcon = createLogoIcon(gcpLogo, 'Google Cloud Platform');

export const sourceTypeIconMap: Record<string, React.FC<IconProps>> = {
  OCP: OpenShiftIcon,
  AWS: AwsIcon,
  Azure: AzureIcon,
  GCP: GcpIcon,
};
