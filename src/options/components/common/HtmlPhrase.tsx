import React from "react";

type Props = {
  phrase: string;
  as?: "p" | "div" | "span";
} & React.HTMLAttributes<HTMLElement>;

const HtmlPhrase = (props: Props) => {
  const { phrase, as } = props;
  const Component = as === undefined ? "span" : as;

  return <Component dangerouslySetInnerHTML={{ __html: phrase }} />;
};

export default HtmlPhrase;
