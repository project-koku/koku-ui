# Presentation

Use functional components. New code does not add class components, `connect`, or `injectIntl`. Rewrite those when transforming a file.

## Reuse order

1. Shared UI already in this app.
2. PatternFly (`@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-charts/victory`).
3. A new component only when neither covers the behavior.

Search before adding a primitive:

| Need | Look in |
|------|---------|
| Tables | `routes/components/dataTable` (`DataTable`, and selectable / expandable variants) |
| Filter toolbars | `routes/components/dataToolbar` (`BasicToolbar`) |
| Menus | `routes/components/dropdownWrapper` |
| Selects | `routes/components/selectWrapper` |
| Currency and cost type | `routes/components/currency`, `routes/components/costType` |
| Unavailable, unauthorized, loading, empty filter, empty cell | `routes/components/page`, `routes/components/state` |
| Chart stylesheet and `getResizeObserver` | `routes/components/charts/common` |
| Settings inputs (rate, selector, text, read-only tooltip) | `routes/settings/components` |
| Notifications, errors, filter helpers | `routes/settings/utils` |

Import the shared data-table stylesheet before using `DataTable`:

```ts
import 'routes/components/dataTable/dataTable.scss';
```

Page query changes (filter, page, per-page, sort) go through `routes/utils/query` when those helpers fit.

## Page composition

The page branches in this order: error (`NotAvailable`), then loading, then no-data empty state, otherwise toolbar plus table. Distinguish no data from a filter that matches nothing. When filters are present, keep the toolbar and let the table show the empty-filter state.

Pagination is PatternFly `Pagination`, top and bottom. Aria titles use the shared pagination message.

Pass `canWrite` into toolbars and action menus. Disable write actions when the user is read-only, and explain that with the shared read-only permissions message on a tooltip.

## Actions and modals

Build menu items as `DropdownWrapperItem[]`. `toString` returns `intl.formatMessage(...)`. Disabled items set `isDisabled` and `tooltipProps`.

```tsx
items.push({
  isDisabled: !canWrite || isDisabled,
  onClick: handleOnDelete,
  toString: () => intl.formatMessage(messages.deleteItem),
  ...(!canWrite && {
    tooltipProps: {
      content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
    },
  }),
});
```

Modals use `Modal`, `ModalHeader`, `ModalBody`, and `ModalFooter`. PatternFly appends the modal to `document.body`, outside the app tree. Set `className="costManagement"` so scoped overrides still apply.

```tsx
<Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
  <ModalHeader title={intl.formatMessage(messages.deleteItemTitle)} titleIconVariant="warning" />
  <ModalBody>{intl.formatMessage(messages.deleteItemDesc)}</ModalBody>
  <ModalFooter>...</ModalFooter>
</Modal>
```

When the same modal is used before an API exists and again after one does, take an `isDispatch` flag (default `true`). `isDispatch` false calls the parent callback. `isDispatch` true is the later store dispatch. The transform leaves the callback path in place and does not add the dispatch.

## Charts

A time range, bar, line, or area is a PatternFly chart from `@patternfly/react-charts/victory` (`Chart`, `ChartAxis`, `ChartBar`, `ChartGroup`, `ChartLine`, `ChartVoronoiContainer`, `ChartTooltip`, and the theme color that fits).

Do not draw charts with positioned `div`s or HTML tables.

Import `routes/components/charts/common/chart.scss` and use `getResizeObserver` from `routes/components/charts/common/chartUtils` when the chart must track its container width. Series colors come from PatternFly chart theme colors or tokens in `*.styles.ts`.

## Styles

Colocate `*.styles.ts` with the component. Export one `styles` object.

```ts
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_color_status_success_default from '@patternfly/react-tokens/dist/js/t_global_color_status_success_default';
import type React from 'react';

export const styles = {
  action: {
    marginLeft: t_global_spacer_md.var,
  },
  active: {
    color: t_global_color_status_success_default.var,
  },
} as { [className: string]: React.CSSProperties };
```

Apply styles as `style={styles.action}`.

- Spacing and color come from `@patternfly/react-tokens/dist/js/<token>` via `.var`.
- Do not use `style={{}}` for layout or color.
- Do not use color names (`green`, `red`), hex values, or one-off pixel palettes.
- Prefer a token in `*.styles.ts` over a new SCSS rule.

Use `*.scss` only to override a PatternFly internal selector. Put the color in a PatternFly CSS variable:

```scss
.iconOverride {
  .pf-v6-c-modal-box__title-icon {
    color: var(--pf-t--global--color--status--warning--default);
  }
}
```

Import that stylesheet from the component that needs the override.
