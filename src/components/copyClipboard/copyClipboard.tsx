import { Button, TextInput } from '@patternfly/react-core';
import { OkIcon, PasteIcon } from '@patternfly/react-icons';
import React from 'react';
import copyfnc from './copyFunc';

interface ClipboardText {
  text: string;
  'aria-label': string;
}
interface CopyText {
  isCopied: boolean;
  onCopy: (event: any) => void;
}

export const CopyClipboardStateless: React.SFC<ClipboardText & CopyText> = ({
  text,
  isCopied,
  'aria-label': ariaLabel,
  onCopy,
}) => (
  <div style={{ position: 'relative' }}>
    {/* Update this once Input Group is merged:
        https://github.com/patternfly/patternfly-react/pull/1108 */}
    <TextInput
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
  </div>
);

interface State {
  wasClicked: boolean;
}

export class CopyClipboard extends React.Component<ClipboardText, State> {
  constructor(props) {
    super(props);
    this.state = { wasClicked: false };
  }

  public render() {
    return (
      <CopyClipboardStateless
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
