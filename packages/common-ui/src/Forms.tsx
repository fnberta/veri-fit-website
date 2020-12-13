import React, {
  ComponentPropsWithoutRef,
  createContext,
  ElementType,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';
import { FieldValidator, useField } from 'formik';
import cx from 'classnames';
import Icon, { IconName } from './Icon';

export const BotField: FC = () => (
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

export interface FieldControlValues {
  name?: string;
  hasError?: boolean;
}

const FieldControlContext = createContext<FieldControlValues>({ name: '', hasError: false });

export function useFieldValues<T extends FieldControlValues>(props: T) {
  const control = useContext(FieldControlContext);
  const name = props.name ?? control.name;
  if (name == null) {
    throw new Error('Name must be specified. Either wrap field in <FieldControl /> or specify name directly.');
  }
  const [input, meta, helper] = useField({ ...props, name });
  const hasError = control.hasError ?? (meta.error != null && meta.touched);

  return {
    field: {
      input,
      meta,
      helper,
    },
    name,
    hasError,
  };
}

export interface FieldControlProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  helperText?: ReactNode;
}

export const FieldControl: FC<FieldControlProps> = ({ name, helperText, children, className, ...rest }) => {
  const [, meta] = useField(name);
  const hasError = meta.error != null && meta.touched;

  return (
    <div className={cx('flex flex-col space-y-1.5', className)} {...rest}>
      <FieldControlContext.Provider value={{ name, hasError }}>{children}</FieldControlContext.Provider>
      {hasError ? (
        <span className="text-xs text-red-500">{meta.error}</span>
      ) : isValidElement(helperText) ? (
        helperText
      ) : helperText ? (
        <span className="text-xs">{helperText}</span>
      ) : null}
    </div>
  );
};

const FieldLabel: FC<{ dark?: boolean }> = ({ dark, children }) => (
  <span className={cx('field-label', dark ? 'text-white' : 'text-gray-700')}>{children}</span>
);

export interface CommonFieldProps {
  label: string | ReactElement;
  dark?: boolean;
  validate?: FieldValidator;
}

function getInputStyleClasses(hasError: boolean): string {
  return cx(
    'w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:border-0 disabled:bg-gray-200 disabled:opacity-50',
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
      : 'border-gray-300 focus:border-gray-500 focus:ring-gray-400',
  );
}

export type ElementProps<T extends ElementType> = ComponentPropsWithoutRef<T> & { hasError?: boolean };

export const Input: FC<ElementProps<'input'>> = ({ hasError, className, ...rest }) => (
  <input className={cx(getInputStyleClasses(hasError === true), className)} {...rest} />
);

export interface InputFieldProps extends ComponentPropsWithoutRef<'input'>, CommonFieldProps {
  icon?: IconName | ReactElement;
}

export const InputField: FC<InputFieldProps> = (props) => {
  const { label, dark, icon, validate, className, ...rest } = props;
  const { field, hasError } = useFieldValues(props);

  return (
    <label className={cx('form-field', className)}>
      {isValidElement(label) ? label : <FieldLabel dark={dark}>{label}</FieldLabel>}
      {icon ? (
        <div className="relative">
          <div className="absolute inset-y-0 pl-3 flex items-center">
            {isValidElement(icon) ? icon : <Icon name={icon} />}
          </div>
          <Input className="pl-10" hasError={hasError} {...field.input} {...rest} />
        </div>
      ) : (
        <Input hasError={hasError} {...field.input} {...rest} />
      )}
    </label>
  );
};

const TextArea: FC<ElementProps<'textarea'>> = ({ hasError, className, ...rest }) => (
  <textarea className={cx(getInputStyleClasses(hasError === true), className)} {...rest} />
);

export interface TextAreaFieldProps extends ComponentPropsWithoutRef<'textarea'>, CommonFieldProps {}

export const TextAreaField: FC<TextAreaFieldProps> = (props) => {
  const { label, dark, validate, className, ...rest } = props;
  const { field, hasError } = useFieldValues(props);

  return (
    <label className={cx('form-field', className)}>
      {isValidElement(label) ? label : <FieldLabel dark={dark}>{label}</FieldLabel>}
      <TextArea hasError={hasError} {...field.input} {...rest} />
    </label>
  );
};

export const Select: FC<ElementProps<'select'>> = ({ hasError, className, ...rest }) => (
  <select className={cx(getInputStyleClasses(hasError === true), className)} {...rest} />
);

export interface SelectFieldProps extends ComponentPropsWithoutRef<'select'>, CommonFieldProps {}

export const SelectField: FC<SelectFieldProps> = (props) => {
  const { label, dark, validate, className, ...rest } = props;
  const { field, hasError } = useFieldValues(props);

  return (
    <label className={cx('form-field', className)}>
      {isValidElement(label) ? label : <FieldLabel dark={dark}>{label}</FieldLabel>}
      <Select hasError={hasError} {...field.input} {...rest} />
    </label>
  );
};

export interface CheckInputFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'>, CommonFieldProps {
  type: 'radio' | 'checkbox';
}

export const CheckInputField: FC<CheckInputFieldProps> = (props) => {
  const { label, dark, validate, className, ...rest } = props;
  const { field } = useFieldValues(props);

  return (
    <label
      className={cx(
        'inline-flex items-center space-x-2',
        {
          ['cursor-not-allowed text-gray-200 opacity-50']: rest.disabled,
        },
        className,
      )}
    >
      <input
        className="rounded shadow-sm text-gray-700 border-gray-300 focus:ring-offset-2 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:border-0 disabled:bg-gray-200"
        {...field.input}
        {...rest}
      />
      {isValidElement(label) ? label : <FieldLabel dark={dark}>{label}</FieldLabel>}
    </label>
  );
};
