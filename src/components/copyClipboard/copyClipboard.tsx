import { Button, TextInput } from '@patternfly/react-core';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  OkIcon,
  PasteIcon,
} from '@patternfly/react-icons';
import React from 'react';
import copyfnc from './copyFunc';

interface ClipboardText {
  text: string;
  'aria-label': string;
  isToggle?: boolean;
}
interface CopyText {
  isCopied: boolean;
  onCopy: (event: any) => void;
}

interface Toggle {
  isExpanded: boolean;
  onExpand: () => void;
}

export const CopyClipboardStateless: React.SFC<
  ClipboardText & CopyText & Toggle
> = ({
  text,
  isCopied,
  'aria-label': ariaLabel,
  onCopy,
  isToggle,
  isExpanded,
  onExpand,
}) => (
  <div style={{ position: 'relative' }}>
    {/* Update this once Input Group is merged:
        https://github.com/patternfly/patternfly-react/pull/1108 */}
    {isToggle && (
      <Button style={{ width: 48 }} onClick={onExpand}>
        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </Button>
    )}
    <TextInput
      style={isToggle ? { position: 'absolute', left: '48px' } : null}
      onChange={() => null}
      isReadOnly
      value={text}
      aria-label={ariaLabel}
    />
    <Button
      onClick={onCopy}
      variant="primary"
      style={{ position: 'absolute', right: '1px' }}
    >
      {isCopied ? <OkIcon /> : <PasteIcon />}
    </Button>
    {isToggle && isExpanded && <div className="pf-c-form-control">{text}</div>}
  </div>
);

interface State {
  wasClicked: boolean;
  expanded: boolean;
}

export class CopyClipboard extends React.Component<ClipboardText, State> {
  constructor(props) {
    super(props);
    this.state = { wasClicked: false, expanded: false };
  }

  public render() {
    return (
      <CopyClipboardStateless
        isToggle={this.props.isToggle}
        isExpanded={this.state.expanded}
        onExpand={() => {
          this.setState({ expanded: !this.state.expanded });
        }}
        text={this.props.text}
        isCopied={this.state.wasClicked}
        aria-label={this.props['aria-label']}
        onCopy={(event: React.FormEvent<HTMLButtonElement>) => {
          copyfnc(event, this.props.text);
          this.setState({ wasClicked: true }, () => {
            const timer = setTimeout(() => {
              this.setState({ wasClicked: false }, () => {
                clearTimeout(timer);
              });
            }, 2000);
          });
        }}
      />
    );
  }
}
