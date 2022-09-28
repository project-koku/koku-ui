import { Pagination, PaginationProps, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';

interface PaginationToolbarTemplateProps extends PaginationProps {
  id?: string;
}

export const PaginationToolbarTemplate: React.FC<PaginationToolbarTemplateProps> = ({
  id,
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

export default PaginationToolbarTemplate;
