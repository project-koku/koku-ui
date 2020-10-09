import {
  Pagination,
  PaginationProps,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarProps,
} from '@patternfly/react-core';
import { TFunction } from 'i18next';
import React from 'react';
import { Translation } from 'react-i18next';

type UniqueProps = Pick<ToolbarProps, 'id' | 'aria-label'>;
type PaginationToolbarTemplateProps = PaginationProps & UniqueProps;

const translatePaginationToolbarProps = (t: TFunction, props: PaginationToolbarTemplateProps) => {
  return {
    ...props,
    'aria-label': t(props['aria-label']),
  };
};

export const PaginationToolbarTemplate: React.FunctionComponent<PaginationToolbarTemplateProps> = props => {
  return (
    <Translation>
      {t => {
        const translatedProps = translatePaginationToolbarProps(t, props);
        const {
          id,
          'aria-label': ariaLabel,
          itemCount,
          perPage,
          page,
          variant,
          onPerPageSelect,
          onSetPage,
        } = translatedProps;
        return (
          <Toolbar id={id}>
            <ToolbarContent aria-label={ariaLabel}>
              <ToolbarItem variant="pagination">
                <Pagination
                  variant={variant}
                  itemCount={itemCount}
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  onPerPageSelect={onPerPageSelect}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        );
      }}
    </Translation>
  );
};

export default PaginationToolbarTemplate;
