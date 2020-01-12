import cx from 'classnames';
import React, { cloneElement, isValidElement } from 'react';
import Icon from './Icon';

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

export interface FormFieldProps extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  label: React.ReactNode;
  control: React.ReactNode;
  icon?: string;
  help?: string;
  error?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, control, icon, help, error, className }) => (
  <div className={cx('field', className)}>
    <label>
      {isValidElement(label) ? (
        cloneElement(label, { className: cx('label', label.props.className) })
      ) : (
        <span className="label">{label}</span>
      )}
      <div className={cx('control', { 'has-icons-left': icon })}>
        {control}
        {icon && <Icon className="is-left" icon={icon} />}
      </div>
    </label>
    {error && <p className="help is-danger">{error}</p>}
    {help && <p className="help">{help}</p>}
  </div>
);
