export interface Inputer {
  value: string;
  setValue: (value: string) => void;
}

export interface Opener {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
