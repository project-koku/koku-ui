import { tagKeyPrefix } from 'api/query';

export interface GetItemLabelParams {
  report: any;
  labelKey: any;
  value: any;
}

export function getItemLabel({ report, labelKey, value }: GetItemLabelParams) {
  let itemLabelKey = String(labelKey);
  if (report.meta && report.meta.group_by) {
    const group_by = report.meta.group_by;
    for (const key of Object.keys(group_by)) {
      if (key.indexOf(tagKeyPrefix)) {
        const tagPrefixKey = tagKeyPrefix + labelKey;
        if (value.hasOwnProperty(tagPrefixKey)) {
          itemLabelKey = tagPrefixKey;
        }
      }
    }
  }
  return itemLabelKey;
}
