import type { Tag } from 'api/tags/tag';
import { TagPathsType, TagType } from 'api/tags/tag';
import { runTag } from 'api/tags/tagUtils';
import { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getTagId } from './tagCommon';
import { selectTag, selectTagFetchStatus } from './tagSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface TagActionMeta {
  tagId: string;
}

export const fetchTagRequest = createAction('tag/request')<TagActionMeta>();
export const fetchTagSuccess = createAction('tag/success')<Tag, TagActionMeta>();
export const fetchTagFailure = createAction('tag/failure')<AxiosError, TagActionMeta>();

export function fetchTag(
  tagPathsType: TagPathsType,
  tagType: TagType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isTagExpired(getState(), tagPathsType, tagType, query)) {
      return;
    }

    const meta: TagActionMeta = {
      tagId: getTagId(tagPathsType, tagType, query),
    };

    dispatch(fetchTagRequest(meta));
    runTag(tagPathsType, tagType, query)
      .then(res => {
        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchTagSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchTagFailure(err, meta));
      });
  };
}

function isTagExpired(state: RootState, tagPathsType: TagPathsType, tagType: TagType, query: string) {
  const tagReport = selectTag(state, tagPathsType, tagType, query);
  const fetchStatus = selectTagFetchStatus(state, tagPathsType, tagType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!tagReport) {
    return true;
  }

  const now = Date.now();
  return now > tagReport.timeRequested + expirationMS;
}
