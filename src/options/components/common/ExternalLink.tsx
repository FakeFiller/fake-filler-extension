import React from "react";

type Props = {
  url: string;
};

const ExternalLink: React.FC<Props> = (props) => {
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

export default ExternalLink;
