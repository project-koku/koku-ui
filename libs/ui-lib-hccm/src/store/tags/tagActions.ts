import type { Tag } from '@koku-ui/api/tags/tag';
import type { TagPathsType, TagType } from '@koku-ui/api/tags/tag';
import { runTag } from '@koku-ui/api/tags/tagUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './tagCommon';
import { selectTag, selectTagError, selectTagFetchStatus } from './tagSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface TagActionMeta {
  fetchId: string;
}

export const fetchTagRequest = createAction('tag/request')<TagActionMeta>();
export const fetchTagSuccess = createAction('tag/success')<Tag, TagActionMeta>();
export const fetchTagFailure = createAction('tag/failure')<AxiosError, TagActionMeta>();

export function fetchTag(
  tagPathsType: TagPathsType,
  tagType: TagType,
  tagQueryString: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isTagExpired(getState(), tagPathsType, tagType, tagQueryString)) {
      return;
    }

    const meta: TagActionMeta = {
      fetchId: getFetchId(tagPathsType, tagType, tagQueryString),
    };

    dispatch(fetchTagRequest(meta));
    runTag(tagPathsType, tagType, tagQueryString)
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

function isTagExpired(state: RootState, tagPathsType: TagPathsType, tagType: TagType, tagQueryString: string) {
  const tagReport = selectTag(state, tagPathsType, tagType, tagQueryString);
  const fetchError = selectTagError(state, tagPathsType, tagType, tagQueryString);
  const fetchStatus = selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!tagReport) {
    return true;
  }

  const now = Date.now();
  return now > tagReport.timeRequested + expirationMS;
}
