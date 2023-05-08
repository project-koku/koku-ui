import type { PaginationProps } from '@patternfly/react-core';
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface PaginationToolbarTemplateProps extends PaginationProps, WrappedComponentProps {
  id?: string;
}

export const PaginationToolbarTemplateBase: React.FC<PaginationToolbarTemplateProps> = ({
  id,
  intl,
  itemCount,
  perPage,
  page,
  variant,
  onPerPageSelect,
  onSetPage,
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
            titles={{
              paginationTitle: intl.formatMessage(messages.paginationTitle, {
                title: intl.formatMessage(messages.createCostModelTitle),
                placement: 'bottom',
              }),
            }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export const PaginationToolbarTemplate = injectIntl(PaginationToolbarTemplateBase);
