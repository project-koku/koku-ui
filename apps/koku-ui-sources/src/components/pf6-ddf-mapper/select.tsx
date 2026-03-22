import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  Select as PFSelect,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import React, { useState } from 'react';

const Select: React.FC<any> = props => {
  const { input, meta, label, isRequired, options = [], isDisabled, placeholder } = useFieldApi(props);
  const [isOpen, setIsOpen] = useState(false);
  const isError = meta.touched && meta.error;

  const selectedLabel = options.find((o: any) => o.value === input.value)?.label || placeholder || 'Select...';

  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={input.name}>
      <PFSelect
        id={input.name}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSelect={(_event, value) => {
          input.onChange(value);
          setIsOpen(false);
        }}
        selected={input.value}
        toggle={toggleRef => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsOpen(prev => !prev)}
            isExpanded={isOpen}
            isDisabled={isDisabled}
            isFullWidth
            status={isError ? 'danger' : undefined}
          >
            {selectedLabel}
          </MenuToggle>
        )}
      >
        <SelectList>
          {options.map((opt: any) => (
            <SelectOption key={opt.value} value={opt.value}>
              {opt.label}
            </SelectOption>
          ))}
        </SelectList>
      </PFSelect>
      <FormHelperText>
        <HelperText>{isError && <HelperTextItem variant="error">{meta.error}</HelperTextItem>}</HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default Select;
