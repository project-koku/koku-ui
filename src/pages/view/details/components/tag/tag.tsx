import { getQuery, parseQuery, Query } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { getTestProps, testIds } from 'testIds';

import { styles } from './tag.styles';
import { TagModal } from './tagModal';

interface TagOwnProps {
  filterBy: string | number;
  groupBy: string;
  id?: string;
  tagReportPathsType: TagPathsType;
}

interface TagState {
  isOpen: boolean;
  showAll: boolean;
}

interface TagStateProps {
  queryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

type TagProps = TagOwnProps & TagStateProps & TagDispatchProps & WithTranslation;

const tagReportType = TagType.tag;

class TagBase extends React.Component<TagProps> {
  protected defaultState: TagState = {
    isOpen: false,
    showAll: false,
  };
  public state: TagState = { ...this.defaultState };

  constructor(props: TagProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    fetchTag(tagReportPathsType, tagReportType, queryString);
  }

  public componentDidUpdate(prevProps: TagProps) {
    const { fetchTag, queryString, tagReportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { filterBy, groupBy, id, tagReport, tagReportPathsType, t } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someTags = [];
    const allTags = [];

    if (tagReport) {
      for (const item of tagReport.data) {
        for (const val of item.values) {
          const prefix = someTags.length > 0 ? ', ' : '';
          const tagString = `${prefix}${(item as any).key}: ${val}`;
          if (showAll) {
            someTags.push(tagString);
          } else if (charCount <= maxChars) {
            if (charCount + tagString.length > maxChars) {
              someTags.push(
                tagString
                  .slice(0, maxChars - charCount)
                  .trim()
                  .concat('...')
              );
            } else {
              someTags.push(tagString);
            }
          }
          charCount += tagString.length;
          allTags.push(`${(item as any).key}: ${val}`);
        }
      }
    }

    return (
      <div style={styles.tagsContainer} id={id}>
        {Boolean(someTags) && someTags.map((val, tagIndex) => <span key={tagIndex}>{val}</span>)}
        {Boolean(someTags.length < allTags.length) && (
          <a {...getTestProps(testIds.details.tag_lnk)} href="#/" onClick={this.handleOpen}>
            {t('details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <TagModal
          filterBy={filterBy}
          groupBy={groupBy}
          isOpen={isOpen}
          onClose={this.handleClose}
          tagReportPathsType={tagReportPathsType}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagOwnProps, TagStateProps>(
  (state, { filterBy, groupBy, tagReportPathsType }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const queryString = getQuery({
      filter: {
        [groupBy]: filterBy,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
        ...(queryFromRoute.filter.account && {
          account: queryFromRoute.filter.account,
        }),
      },
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      queryString
    );
    return {
      filterBy,
      queryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: TagDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const Tag = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TagBase));

export { Tag, TagProps };
