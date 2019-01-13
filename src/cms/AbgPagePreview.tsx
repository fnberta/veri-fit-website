import React from 'react';
import { AgbTemplate } from '../templates/AgbPageTemplate';
import { PreviewProps } from './cms';

const AgbPagePreview: React.FC<PreviewProps> = ({ entry, widgetFor }) => (
  <AgbTemplate
    title={entry.getIn(['data', 'title'])}
    subtitle={entry.getIn(['data', 'subtitle'])}
    body={widgetFor('body')}
  />
);

export default AgbPagePreview;
