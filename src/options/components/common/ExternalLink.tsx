import * as React from 'react';

interface IOwnProps {
  url: string;
}

class ExternalLink extends React.PureComponent<IOwnProps> {
  public render(): JSX.Element {
    return (
      <a href={this.props.url} target="_blank" rel="noopener noreferrer">
        {this.props.children}
      </a>
    );
  }
}

export default ExternalLink;
