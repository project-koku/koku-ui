import { tagPrefix } from '../../../utils/props';

export interface GetItemLabelParams {
  idKey: any;
  report: any;
  value: any;
}

export function getItemLabel({ idKey, report, value }: GetItemLabelParams) {
  let itemLabelKey = String(idKey);
  if (report?.meta?.group_by) {
    const group_by = report.meta.group_by;
    for (const key of Object.keys(group_by)) {
      if (key.indexOf(tagPrefix)) {
        const tagPrefixKey = tagPrefix + idKey;
        if (value.hasOwnProperty(tagPrefixKey)) {
          itemLabelKey = tagPrefixKey;
        }
      }
    }
  }
  return itemLabelKey;
}
