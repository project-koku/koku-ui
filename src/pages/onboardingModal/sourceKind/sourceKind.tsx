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
  checked: object;
  updateCheck: typeof onboardingActions.updateSourceKindCheckList;
  checkAll: typeof onboardingActions.checkSourceKindCheckList;
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
  checkAll,
}) => {
  const updateNameText = (_name, event: React.FormEvent<HTMLInputElement>) => {
    updateName(event.currentTarget.value, sourceNameValidator);
  };
  const updateTypeOption = (event: React.FormEvent<HTMLSelectElement>) => {
    updateType(event as any, sourceTypeValidator);
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
      {Boolean(type !== '') && (
        <SourceKindCheckList
          t={t}
          checkedItems={checked}
          updateCheckItem={updateCheckItem}
          checkAll={() => {
            checkAll();
          }}
        />
      )}
    </React.Fragment>
  );
};

export default SourceKind;
