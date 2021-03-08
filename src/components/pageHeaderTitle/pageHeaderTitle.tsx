import { Title } from '@patternfly/react-core';
import classNames from 'classnames';
import React from 'react';

// Note: Temp workaround for PageHeaderTitle not exported via @redhat-cloud-services/frontend-components/PageHeader

interface PageHeaderProps {
  className?: string;
  title: string;
}

const PageHeaderTitle: React.SFC<PageHeaderProps> = ({ className, title }) => {
  const pageHeaderTitleClasses = classNames(className);

  return (
    <Title headingLevel="h1" size="2xl" className={pageHeaderTitleClasses}>
      {title}
    </Title>
  );
};

export { PageHeaderTitle };
