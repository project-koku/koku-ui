import {
  Button,
  ButtonVariant,
  Checkbox,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { TagValue } from 'api/rates';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import { formatCurrencyRaw, getCurrencySymbol } from 'utils/format';

import { styles } from './tagValues.styes';

interface TagValuesOwnProps {
  currency?: string;
  errors?: any;
  onDelete?: (index) => void;
  onDefaultChange?: (value, index) => void;
  onDescriptionChange?: (value, index) => void;
  onRateChange?: (value, index) => void;
  onValueChange?: (value, index) => void;
  tagValues?: TagValue[];
}

type TagValuesProps = TagValuesOwnProps;

const TagValues: React.FC<TagValuesProps> = ({
  currency,
  errors,
  onDelete,
  onDefaultChange,
  onDescriptionChange,
  onRateChange,
  onValueChange,
  tagValues,
}) => {
  const intl = useIntl();

  const requiredColumnMark = (
    <span aria-hidden className="pf-v6-c-form__label-required">
      &nbsp;{'*'}
    </span>
  );

  return (
    <Table aria-label={intl.formatMessage(messages.costModelsEnterTagRate)} borders={false} variant={'compact'}>
      <Thead noWrap>
        <Tr>
          <Th></Th>
          <Th>
            {intl.formatMessage(messages.priceListTagValue)}
            {requiredColumnMark}
          </Th>
          <Th>
            {intl.formatMessage(messages.rate)}
            {requiredColumnMark}
          </Th>
          <Th>{intl.formatMessage(messages.description)}</Th>
          <Th>{intl.formatMessage(messages.default)}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tagValues?.map((item, index) => {
          const isOddRow = (index + 1) % 2;
          return (
            <Tr key={`tag-values-${index}`} style={isOddRow ? styles.oddRow : {}}>
              <Td style={styles.vertAlign}>
                <span className="pf-v6-u-font-size-sm">
                  <span className="pf-v6-u-text-break-word">{intl.formatMessage(messages.equalsSymbol)}</span>
                </span>
              </Td>
              <Td dataLabel={intl.formatMessage(messages.priceListTagValue)}>
                <TextInput
                  aria-label={intl.formatMessage(messages.priceListTagValue)}
                  id={`tag-values-value-${index}`}
                  isRequired
                  onChange={(_evt, value) => onValueChange(value, index)}
                  placeholder={intl.formatMessage(messages.priceListEnterTagValue)}
                  validated={errors?.[index]?.tag_value ? 'error' : 'default'}
                  value={item.tag_value}
                />
                {errors?.[index]?.tag_value && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(errors?.[index]?.tag_value)}</HelperTextItem>
                  </HelperText>
                )}
              </Td>
              <Td dataLabel={intl.formatMessage(messages.rate)}>
                <InputGroup>
                  <InputGroupText style={styles.currency}>{getCurrencySymbol(currency)}</InputGroupText>
                  <InputGroupItem isFill>
                    <TextInput
                      aria-label={intl.formatMessage(messages.rate)}
                      isRequired
                      id={`tag-values-rate-${index}`}
                      onChange={(_evt, value) => onRateChange(value, index)}
                      placeholder={formatCurrencyRaw(0, currency, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      type="text"
                      validated={errors?.[index]?.value ? 'error' : 'default'}
                      value={item.value}
                    />
                  </InputGroupItem>
                </InputGroup>
                {errors?.[index]?.value && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(errors?.[index]?.value)}</HelperTextItem>
                  </HelperText>
                )}
              </Td>
              <Td dataLabel={intl.formatMessage(messages.priceListEnterTagDescription)}>
                <TextArea
                  aria-label={intl.formatMessage(messages.priceListEnterTagDescription)}
                  id={`tag-values-description-${index}`}
                  onChange={(_evt, value) => onDescriptionChange(value, index)}
                  placeholder={intl.formatMessage(messages.priceListEnterTagDescription)}
                  resizeOrientation="vertical"
                  rows={1}
                  validated={errors?.[index]?.description ? 'error' : 'default'}
                  value={item.description}
                />
                {errors?.[index]?.description && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(errors[index].description)}</HelperTextItem>
                  </HelperText>
                )}
              </Td>
              <Td dataLabel={intl.formatMessage(messages.default)} style={styles.vertAlign}>
                <Checkbox
                  aria-label={intl.formatMessage(messages.default)}
                  label={intl.formatMessage(messages.default)}
                  id={`tag-value-default-${index}`}
                  isChecked={item.default}
                  onChange={(_evt, checked) => onDefaultChange(checked, index)}
                />
              </Td>
              <Td>
                <ReadOnlyTooltip defaultMsg={messages.priceListRemoveTag}>
                  <Button
                    aria-label={intl.formatMessage(messages.priceListRemoveTag)}
                    icon={<MinusCircleIcon />}
                    isDisabled={tagValues.length === 1}
                    onClick={() => onDelete(index)}
                    variant={ButtonVariant.plain}
                  ></Button>
                </ReadOnlyTooltip>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export { TagValues };
