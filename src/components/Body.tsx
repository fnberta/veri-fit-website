import React from 'react';

export interface Props {
  data: string | object;
}

const Body: React.FC<Props> = ({ data }) => {
  if (typeof data === 'string') {
    return <div className="content" dangerouslySetInnerHTML={{ __html: data }} />;
  }

  return <div className="content">{data}</div>;
};

export default Body;
