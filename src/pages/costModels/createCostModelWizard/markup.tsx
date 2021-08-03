import {
  Flex,
  FlexItem,
  FormGroup,
  InputGroup,
  InputGroupText,
  List,
  ListItem,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { Form } from 'components/forms/form';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { styles } from '../costModel/costCalc.styles';
import { CostModelContext } from './context';

class MarkupWithDistribution extends React.Component<WithTranslation> {
  public render() {
    const { t } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          handleDistributionChange,
          handleSignChange,
          handleOnKeyDown,
          handleMarkupDiscountChange,
          markupValidator,
          markup,
          isDiscount,
          distribution,
          type,
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size={TitleSizes.xl}>
                  {t('cost_calculations')}
                </Title>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {t('cost_models_details.markup_or_discount')}
                </Title>
                {t('cost_models_wizard.description_markup_or_discount_model')}
              </StackItem>
              <StackItem>
                <Flex style={styles.markupRadioContainer}>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <Radio
                        isChecked={!isDiscount}
                        name="discount"
                        label={t('cost_models_details.markup_plus')}
                        aria-label={t('cost_models_details.markup_plus')}
                        id="markup"
                        value="false" // "+"
                        onChange={handleSignChange}
                        style={styles.markupRadio}
                      />
                      <Radio
                        isChecked={isDiscount}
                        name="discount"
                        label={t('cost_models_details.discount_minus')}
                        aria-label={t('cost_models_details.discount_minus')}
                        id="discount"
                        value="true" // '-'
                        onChange={handleSignChange}
                      />
                    </FlexItem>
                  </Flex>
                  <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                    <FlexItem>
                      <InputGroup style={styles.rateContainer}>
                        <InputGroupText style={styles.sign}>{isDiscount ? '-' : '+'}</InputGroupText>
                        <TextInput
                          style={styles.inputField}
                          type="text"
                          aria-label={t('rate')}
                          id="markup-input-box"
                          value={markup}
                          onKeyDown={handleOnKeyDown}
                          onChange={handleMarkupDiscountChange}
                          validated={markupValidator()}
                        />
                        <InputGroupText style={styles.percent}>%</InputGroupText>
                      </InputGroup>
                    </FlexItem>
                  </Flex>
                </Flex>
              </StackItem>
              <StackItem>
                <div style={styles.exampleMargin}>
                  <TextContent>
                    <Text component={TextVariants.h6}>{t('cost_models_details.examples.title')}</Text>
                  </TextContent>
                  <List>
                    <ListItem>{t('cost_models_details.examples.noAdjustment')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.doubleMarkup')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.reduceBaseToZero')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.reduceBaseToSeventyFive')}</ListItem>
                  </List>
                </div>
              </StackItem>
              {type === 'OCP' && (
                <>
                  <StackItem>
                    <Title headingLevel="h3" size="md">
                      {t('cost_models_details.distribution_type')}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>
                        {t('cost_models_details.description_distribution_model')}
                      </Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution" isRequired>
                        <Radio
                          isChecked={distribution === 'cpu'}
                          name="distribution"
                          label={t('cpu_title')}
                          aria-label={t('cpu_title')}
                          id="cpuDistribution"
                          value="cpu"
                          onChange={handleDistributionChange}
                        />
                        <Radio
                          isChecked={distribution === 'memory'}
                          name="distribution"
                          label={t('memory_title')}
                          aria-label={t('memory_title')}
                          id="memoryDistribution"
                          value="memory"
                          onChange={handleDistributionChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </>
              )}
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default withTranslation()(MarkupWithDistribution);
