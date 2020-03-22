import React from 'react';
import cx from 'classnames';

export interface FormFieldProps extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  label: React.ReactNode;
  control: React.ReactNode;
  help?: string;
  error?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ control, label, error, htmlFor, className, ...rest }) => (
  <div className={cx('grid gap-1', className)} {...rest}>
    <label className="text-sm" htmlFor={htmlFor}>
      {label}
    </label>
    {control}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const BotField: React.FC = () => (
  <div className="hidden">
    <label>
      Don't fill this out if you're human: <input name="bot-field" />
    </label>
  </div>
);
