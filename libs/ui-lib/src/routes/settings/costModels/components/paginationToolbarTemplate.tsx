import type { PaginationProps } from '@patternfly/react-core';
import type { PaginationTitles } from '@patternfly/react-core';
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { styles } from '../costModel/costModelInfo.styles';

interface PaginationToolbarTemplateProps extends PaginationProps, WrappedComponentProps {
  id?: string;
  titles?: PaginationTitles;
}

export const PaginationToolbarTemplateBase: React.FC<PaginationToolbarTemplateProps> = ({
  id,
  itemCount,
  perPage,
  page,
  variant,
  onPerPageSelect,
  onSetPage,
  titles,
}) => {
  return (
    <Toolbar id={id}>
      <ToolbarContent>
        <ToolbarItem variant="pagination">
          <Pagination
            variant={variant}
            itemCount={itemCount}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            style={styles.pagination}
            titles={titles}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export const PaginationToolbarTemplate = injectIntl(PaginationToolbarTemplateBase);
