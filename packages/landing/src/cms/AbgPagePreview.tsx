import React, { FC } from 'react';
import { AgbTemplate } from '../templates/AgbPageTemplate';
import { PreviewProps } from './interfaces';

const AgbPagePreview: FC<PreviewProps> = ({ entry, widgetFor }) => (
  <AgbTemplate
    title={entry.getIn(['data', 'title']) as string}
    subtitle={entry.getIn(['data', 'subtitle']) as string}
    body={widgetFor('body')}
  />
);

export default AgbPagePreview;
