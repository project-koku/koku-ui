import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tab,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from '../costModelsDetails.styles';

interface Props extends InjectedTranslateProps {
  goBack: () => void;
  name: string;
  description?: string;
  type: string;
  tabRefs: any[];
  tabIndex: number;
  onSelectTab: (index: number) => void;
}

class Header extends React.Component<Props> {
  public cmpRef = React.createRef<HTMLElement>();
  public componentDidMount() {
    this.cmpRef.current.scrollIntoView();
  }
  public render() {
    const {
      t,
      tabRefs,
      tabIndex,
      onSelectTab,
      goBack,
      name,
      description,
      type,
    } = this.props;
    return (
      <header ref={this.cmpRef} className={css(styles.headerCostModel)}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button
              style={{ paddingLeft: '0', paddingRight: '0' }}
              onClick={goBack}
              variant="link"
            >
              {t('cost_models_details.cost_model.cost_models')}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{name}</BreadcrumbItem>
        </Breadcrumb>
        <br />
        <Title className={css(styles.title)} size="2xl">
          {name}
        </Title>
        {description && (
          <>
            <Title className={css(styles.title)} size="md">
              {description}
            </Title>
            <br />
          </>
        )}
        <Title className={css(styles.title)} size="md">
          {t('cost_models_details.cost_model.source_type')}: {type}
        </Title>
        <Tabs
          activeKey={tabIndex}
          onSelect={(_evt, index: number) => onSelectTab(index)}
        >
          <Tab
            eventKey={0}
            title="Price list"
            tabContentId="refPriceList"
            tabContentRef={tabRefs[0]}
          />
          <Tab
            eventKey={1}
            title="Markup"
            tabContentId="refMarkup"
            tabContentRef={tabRefs[1]}
          />
          <Tab
            eventKey={2}
            title="Sources"
            tabContentId="refSources"
            tabContentRef={tabRefs[2]}
          />
        </Tabs>
      </header>
    );
  }
}

export default translate()(Header);
