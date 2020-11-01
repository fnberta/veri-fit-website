import React from 'react';
import { FieldConfig, useField } from 'formik';
import cx from 'classnames';

export const BotField: React.FC = () => (
  <div className="hidden">
    <label>
      Don't fill this out if you're human: <input name="bot-field" />
    </label>
  </div>
);

export function makeValidator(name: string) {
  return (value: string) => (value.length === 0 ? `${name} ist erforderlich` : undefined);
}

export function urlEncode(data: Record<string, string | number | boolean>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

export interface CommonFieldProps<T> extends FieldConfig<T> {
  label: string;
  dark?: boolean;
}

export type InputFieldProps = React.ComponentPropsWithoutRef<'input'> & CommonFieldProps<string>;

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, meta] = useField(props);
  const { label, dark, className, ...rest } = props;

  return (
    <label className={cx('form-field', className)}>
      <span className={cx('form-label', dark && 'text-white')}>{label}</span>
      <input className="form-input w-full" {...field} {...rest} />
      {meta.error && meta.touched && <span className="form-error">{meta.error}</span>}
    </label>
  );
};

export type TextAreaFieldProps = React.ComponentPropsWithoutRef<'textarea'> & CommonFieldProps<string>;

export const TextAreaField: React.FC<TextAreaFieldProps> = (props) => {
  const [field, meta] = useField(props);
  const { label, dark, className, ...rest } = props;

  return (
    <label className={cx('form-field', className)}>
      <span className={cx('form-label', dark && 'text-white')}>{label}</span>
      <textarea className="form-textarea w-full" {...field} {...rest} />
      {meta.error && meta.touched && <span className="form-error">{meta.error}</span>}
    </label>
  );
};

export type SelectFieldProps = React.ComponentPropsWithoutRef<'select'> & CommonFieldProps<string>;

export const SelectField: React.FC<SelectFieldProps> = (props) => {
  const [field, meta] = useField(props);
  const { label, dark, className, children, ...rest } = props;

  return (
    <label className={cx('form-field', className)}>
      <span className={cx('form-label', dark && 'text-white')}>{label}</span>
      <select className="form-select" {...field} {...rest}>
        {children}
      </select>
      {meta.error && meta.touched && <span className="form-error">{meta.error}</span>}
    </label>
  );
};
