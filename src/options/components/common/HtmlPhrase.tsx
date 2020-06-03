import React from 'react';

type Props = {
  phrase: string;
  as?: 'p' | 'div' | 'span';
} & React.HTMLAttributes<HTMLElement>;

export default function HtmlPhrase(props: Props): JSX.Element {
  const { phrase, as } = props;
  const Component = as === undefined ? 'span' : as;

  // eslint-disable-next-line react/no-danger
  return <Component dangerouslySetInnerHTML={{ __html: phrase }} />;
}
