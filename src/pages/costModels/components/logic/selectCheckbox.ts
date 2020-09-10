export const checkBoxLogic = (current: string[], selection: string): string[] => {
  return current.includes(selection) ? deleteChip(current, selection) : [...current, selection];
};

export const deleteChip = (current: string[], selection: string): string[] => {
  return current.filter(chip => chip !== selection);
};
