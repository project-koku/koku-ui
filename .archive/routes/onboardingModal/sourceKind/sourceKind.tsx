import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { onboardingActions } from 'store/onboarding';
import { sourceNameValidator, sourceTypeValidator } from 'utils/validators';
import SourceKindCheckList from './checkList';
import SourceKindForm from './form';
import SourceKindInstructions from './instructions';

interface Props extends InjectedTranslateProps {
  name: string;
  updateName: typeof onboardingActions.updateName;
  nameValid: boolean;
  type: string;
  updateType: typeof onboardingActions.updateType;
  typeValid: boolean;
  checked: { [k: string]: boolean };
  updateCheck: typeof onboardingActions.updateSourceKindCheckList;
}

const SourceKind: React.SFC<Props> = ({
  t,
  name,
  updateName,
  nameValid,
  type,
  updateType,
  typeValid,
  checked,
  updateCheck,
}) => {
  const updateNameText = (_name, event: React.FormEvent<HTMLInputElement>) => {
    updateName(event.currentTarget.value, sourceNameValidator);
  };
  const updateTypeOption = (
    value: string,
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    updateType(value, sourceTypeValidator);
  };
  const updateCheckItem = (
    value: boolean,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    updateCheck({ item: event.currentTarget.id, value });
  };
  return (
    <React.Fragment>
      <SourceKindInstructions t={t} />
      <SourceKindForm
        updateName={updateNameText}
        updateType={updateTypeOption}
        name={name}
        nameValid={nameValid}
        type={type}
        typeValid={typeValid}
        t={t}
      />
      <br />
      {Boolean(type === 'OCP') && (
        <SourceKindCheckList
          checkedItems={checked}
          updateCheckItem={updateCheckItem}
        />
      )}
    </React.Fragment>
  );
};

export default SourceKind;
