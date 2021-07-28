import {
  FormGroup,
  Grid,
  GridItem,
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
  Title,
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
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="xl">
                  {t('cost_calculations')}
                </Title>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {t('cost_models_details.markup_or_discount')}
                </Title>
                <TextContent>
                  <Text>{t('cost_models_wizard.description_markup_or_discount_model')}</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Form>
                  <Grid hasGutter>
                    <GridItem lg={8} id="refSign">
                      <FormGroup isInline fieldId="markup-or-discount">
                        <div style={styles.radioAlign}>
                          <Radio
                            isChecked={!isDiscount}
                            name="discount"
                            label={t('cost_models_details.markup_plus')}
                            aria-label={t('cost_models_details.markup_plus')}
                            id="markup"
                            value="false" // "+"
                            onChange={handleSignChange}
                          />
                        </div>
                        <div style={styles.radioAlign}>
                          <Radio
                            isChecked={isDiscount}
                            name="discount"
                            label={t('cost_models_details.discount_minus')}
                            aria-label={t('cost_models_details.discount_minus')}
                            id="discount"
                            value="true" // '-'
                            onChange={handleSignChange}
                          />
                        </div>
                      </FormGroup>
                    </GridItem>
                    <GridItem lg={4} id="refMarkup">
                      <FormGroup
                        isInline
                        fieldId="rate"
                        helperTextInvalid={t('cost_models_wizard.markup.invalid_markup_text')}
                      >
                        <InputGroup style={{ width: '150px' }}>
                          <InputGroupText style={styles.sign}>{isDiscount ? '-' : '+'}</InputGroupText>
                          <TextInput
                            style={{ borderLeft: '0' }}
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
                      </FormGroup>
                    </GridItem>
                  </Grid>
                </Form>
              </StackItem>
              <StackItem>
                <div style={styles.exampleMargin}>
                  <TextContent>
                    <Text>{t('cost_models_details.examples.title')}</Text>
                  </TextContent>
                  <List>
                    <ListItem>{t('cost_models_details.examples.noAdjustment')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.doubleMarkup')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.reduceBaseToZero')}</ListItem>
                    <ListItem>{t('cost_models_details.examples.reduceBaseToSeventyFive')}</ListItem>
                  </List>
                </div>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {t('cost_models_details.distribution_type')}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{t('cost_models_details.description_distribution_model')}</Text>
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
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default withTranslation()(MarkupWithDistribution);
