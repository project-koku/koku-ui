import React from 'react';

import { Button, Form, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

import helpers from '../../utils/helpers';

export interface Props {
  id?: PropTypes.string;
  expandDescription?: PropTypes.string;
  label?: PropTypes.string;
  labelDescription?: PropTypes.string;
  multiline?: PropTypes.bool;
  resetTimer?: PropTypes.number;
  value: PropTypes.string.isRequired;
}

class CopyField extends React.Component<Props> {
  public state = {
    copied: false,
    expanded: false,
    timer: null,
  };

  public onCopy = event => {
    const { timer } = this.state;
    const { value } = this.props;
    const success = helpers.copyClipboard(value);

    event.target.blur();
    clearTimeout(timer);

    this.setState(
      {
        copied: success,
      },
      () => this.resetStateTimer()
    );
  };

  public onExpand = event => {
    const { expanded } = this.state;
    event.target.blur();

    this.setState({
      expanded: !expanded,
    });
  };

  public onSelect = event => {
    event.target.select();
  };

  public resetStateTimer() {
    const { resetTimer } = this.props;

    const timer = setTimeout(
      () =>
        this.setState({
          copied: false,
        }),
      resetTimer
    );

    this.setState({ timer });
  }

  public render() {
    const { copied, expanded } = this.state;
    const {
      id,
      label,
      labelDescription,
      multiline,
      expandDescription,
      value,
    } = this.props;
    const setId = id || helpers.generateId(null);

    return (
      <Form.FormGroup
        className="cloudmeter-copy"
        controlId={setId}
        aria-live="polite"
      >
        <Form.InputGroup>
          {multiline && (
            <Form.InputGroup.Button>
              <Button
                onClick={this.onExpand}
                className="cloudmeter-copy-display-button"
                aria-hidden
                tabIndex={-1}
              >
                {!expanded && <Icon type="fa" name="angle-right" />}
                {expanded && <Icon type="fa" name="angle-down" />}
              </Button>
            </Form.InputGroup.Button>
          )}
          <Form.FormControl
            type="text"
            value={value}
            className={`cloudmeter-copy-input ${expanded && 'expanded'}`}
            readOnly
            aria-label={expandDescription}
            onClick={this.onSelect}
          />
          <Form.InputGroup.Button>
            <Button onClick={this.onCopy} aria-label={labelDescription}>
              {(!copied && label) ||
                (copied && (
                  <React.Fragment>
                    <Icon type="fa" name="check" /> Copied
                  </React.Fragment>
                ))}
            </Button>
          </Form.InputGroup.Button>
        </Form.InputGroup>
        {expanded && (
          <textarea
            className="cloudmeter-copy-display"
            rows={5}
            aria-label={expandDescription}
            disabled
            value={value}
            aria-hidden
          />
        )}
      </Form.FormGroup>
    );
  }
}

(CopyField as any).propTypes = {
  id: PropTypes.string,
  expandDescription: PropTypes.string,
  label: PropTypes.string,
  labelDescription: PropTypes.string,
  multiline: PropTypes.bool,
  resetTimer: PropTypes.number,
  value: PropTypes.string.isRequired,
};

(CopyField as any).defaultProps = {
  id: null,
  expandDescription: null,
  label: 'Copy',
  labelDescription: null,
  multiline: false,
  resetTimer: 8000,
};

export { CopyField as default, CopyField };
