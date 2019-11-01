import cx from 'classnames';
import React from 'react';
import { ClassNameProps } from '../../interfaces';
import Icon from './Icon';
import styled from '@emotion/styled';

export interface HorizontalFieldProps {
  label?: React.ReactNode;
}

export const HorizontalField: React.FC<HorizontalFieldProps> = ({ label, children }) => (
  <div className="field is-horizontal">
    {label != null && (
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
    )}
    <div className="field-body is-expanded">{children}</div>
  </div>
);

export interface FormFieldProps extends ClassNameProps {
  label?: React.ReactNode;
  control: React.ReactNode;
  short?: boolean;
  icon?: string;
  help?: string;
  error?: string;
}

const Field = styled.div<{ short?: boolean }>(props => ({
  maxWidth: props.short === true ? '10rem' : undefined,
}));

export const FormField: React.FC<FormFieldProps> = ({ label, control, short, icon, help, error, className }) => (
  <Field className={cx('field', className)} short={short}>
    {label != null && <label className="label">{label}</label>}
    <div
      className={cx('control', {
        'has-icons-left': icon,
        'has-icons-right': error,
      })}
    >
      {control}
      {icon && <Icon className="is-left" icon={icon} />}
      {error && <Icon className="is-small is-right" icon="fa-exclamation-triangle" />}
    </div>
    {error && <p className="help is-danger">{error}</p>}
    {help && <p className="help">{help}</p>}
  </Field>
);
