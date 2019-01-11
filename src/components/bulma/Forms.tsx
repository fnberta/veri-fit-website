import cx from 'classnames';
import React from 'react';
import Icon from './Icon';

export interface SubmitButtonProps {
  text: string;
  submitting?: boolean;
}

export interface FormFieldProps {
  label?: React.ReactNode;
  control: React.ReactNode;
  icon?: string;
  help?: string;
  error?: string;
}

export interface HorizontalFieldProps {
  label?: React.ReactNode;
}

export const HorizontalField: React.FC<HorizontalFieldProps> = ({ label, children }) => (
  <div className="field is-horizontal">
    {label && <div className="field-label is-normal">{label}</div>}
    <div className="field-body is-expanded">{children}</div>
  </div>
);

export const FormField: React.FC<FormFieldProps> = ({ label, control, icon, help, error }) => (
  <div className="field">
    {label}
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
    {help && <p className="help">This is a help text</p>}
  </div>
);

export const SubmitButton: React.FC<SubmitButtonProps> = ({ text, submitting }) => (
  <div className="control">
    <button className={cx('button', 'is-primary', { 'is-loading': submitting })} type="submit" disabled={submitting}>
      {text}
    </button>
  </div>
);
