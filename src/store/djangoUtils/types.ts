import { PagedLinks, PagedMetaData } from 'api/api';

export interface PageResults {
  meta: PagedMetaData;
  links?: PagedLinks;
}
