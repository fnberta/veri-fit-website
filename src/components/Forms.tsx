import React from 'react';
import cx from 'classnames';

export interface FormFieldProps extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  label: React.ReactNode;
  control: React.ReactNode;
  icon?: string;
  help?: string;
  error?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ control, label, error, htmlFor, className, ...rest }) => (
  <div className={cx('grid gap-1', className)} {...rest}>
    <label className="text-sm" htmlFor={htmlFor}>
      {label}
    </label>
    {control}
    <p className="text-xs text-red-500">{error}</p>
  </div>
);
