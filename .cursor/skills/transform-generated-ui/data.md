# Data, copy, and tests

## useMapToProps

The component that owns a fetch reads `data`, `error`, and `fetchStatus` from `useMapToProps` at the bottom of that same file. The page keeps local query state (`limit`, `offset`, `filter_by`, `order_by`) and passes the query in.

Until an API exists, `useMapToProps` returns mocked values in that shape. Do not add `useDispatch`, selectors, or `useEffect` fetches during the transform. The return shape stays stable so those calls can replace the mock body later without rewriting the view.

Do not keep a sessionStorage provider, a mega context, or a fake backend as the architecture. If several components share fixtures, put the fixtures in a small data module next to the feature and return them from `useMapToProps`.

```tsx
import type { Query } from 'api/queries/query';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';

interface ItemListMapProps {
  query?: Query;
}

interface ItemListStateProps {
  items?: Item[];
  itemsError?: AxiosError;
  itemsFetchStatus?: FetchStatus;
}

const ItemList: React.FC<ItemListProps> = ({ canWrite }) => {
  const [query, setQuery] = useState({ ...baseQuery });
  const { items, itemsError, itemsFetchStatus } = useMapToProps({ query });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoItems = (!items || items.length === 0) && !hasFilters;
  // ...
};

const useMapToProps = ({ query }: ItemListMapProps): ItemListStateProps => {
  // Prototype seam. Keep this signature and return shape.
  // When an API exists, replace the body with dispatch, selectors, and useEffect.
  return {
    items: mockItems,
    itemsError: undefined,
    itemsFetchStatus: FetchStatus.complete,
  };
};
```

Accept `query` even while the mock ignores it, so the later fetch can use the same argument. A modal that only needs status uses the same pattern with no arguments.

Hooks shared by more than one surface (duplicate, enable, notifications) live in the feature's `utils`, not inside the mock provider they replace.

## Copy

Every user-visible string uses `messages` from `locales/messages` and `useIntl().formatMessage`. Add entries to the app message catalog with `defineMessages`. Each entry has `id`, `defaultMessage`, and `description`.

```tsx
const intl = useIntl();

intl.formatMessage(messages.itemListDesc, {
  learnMore: (
    <a href={intl.formatMessage(messages.docsItemList)} rel="noreferrer" target="_blank">
      {intl.formatMessage(messages.learnMore)}
    </a>
  ),
});
```

```ts
itemListDesc: {
  defaultMessage: 'Review and update items. {learnMore}',
  description: 'Item list description',
  id: 'itemListDesc',
},
```

This includes titles, buttons, empty states, tooltips, aria labels, pagination titles, and validation messages. Seed records used as mock data may keep literal field values. UI chrome around that data still goes through `messages`.

Do not leave English in thrown errors that the UI displays. Do not add new `injectIntl` wrappers.

## Tests

Add a colocated `*.test.tsx` (or `*.test.ts` for pure utils) for each new public component. Use React Testing Library: `render`, `screen`, `fireEvent` or `userEvent`, and `waitFor`.

- Wrap with `IntlProvider`. Add `Provider` and `MemoryRouter` when the component needs them.
- Mock child table and toolbar components.
- Mock the feature hooks that would dispatch later.
- Assert behavior: empty versus data, filter and sort callbacks, a modal opening.
- Do not add snapshot tests.

When writing or rewriting those tests, follow the `pf-unit-test-standards` subagent.
