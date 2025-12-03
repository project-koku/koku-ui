import type { PagedLinks, PagedMetaData } from '@koku-ui/api/api';

export interface PageResults {
  meta: PagedMetaData;
  links?: PagedLinks;
}
