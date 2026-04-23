import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { Card, CardBody, CardHeader, Grid, GridItem, Title } from '@patternfly/react-core';
import React from 'react';

export const CardSelect: React.FC<any> = props => {
  const { input, options = [], iconMapper } = useFieldApi(props);

  const handleSelect = (value: string) => {
    input.onChange(value);
    input.onBlur();
  };

  return (
    <Grid hasGutter>
      {options.map((opt: any) => {
        const Icon = iconMapper?.(opt.value);
        const isSelected = input.value === opt.value;
        return (
          <GridItem key={opt.value} span={6}>
            <Card isSelectable isSelected={isSelected}>
              <CardHeader
                selectableActions={{
                  selectableActionId: `card-select-${opt.value}`,
                  selectableActionAriaLabel: opt.label,
                  name: input.name,
                  variant: 'single',
                  isHidden: true,
                  isChecked: isSelected,
                  onChange: () => handleSelect(opt.value),
                }}
              />
              <CardBody style={{ textAlign: 'center' }}>
                {Icon && <Icon style={{ width: 40, height: 40, marginBottom: 'var(--pf-t--global--spacer--md)' }} />}
                <Title headingLevel="h3" size="lg">
                  {opt.label}
                </Title>
              </CardBody>
            </Card>
          </GridItem>
        );
      })}
    </Grid>
  );
};

CardSelect.displayName = 'CardSelect';
