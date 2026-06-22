import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { styles } from './costModelCreateHeader.styles';

interface CostModelCreateHeaderOwnProps {
  // TBD...
}

type CostModelCreateHeaderProps = CostModelCreateHeaderOwnProps;

const CostModelCreateHeader: React.FC<CostModelCreateHeaderProps> = () => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <div style={styles.headerContent}>
      <Breadcrumb style={styles.breadcrumb}>
        <BreadcrumbItem
          render={() => (
            <Link
              to={`${formatPath(routes.settings.path)}`}
              state={{
                ...(location?.state || {}),
                settingsState: {
                  activeTabKey: 0,
                },
              }}
            >
              {intl.formatMessage(messages.costModels)}
            </Link>
          )}
        />
        <BreadcrumbItem isActive>{intl.formatMessage(messages.costModelsWizardCreateCostModel)}</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export { CostModelCreateHeader };
