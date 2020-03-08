import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import BulletItem from '../components/BulletItem';
import { Button, IconButton } from '../components/Button';
import { FormField } from '../components/Forms';
import { makeValidator } from '../utils/forms';
import cx from 'classnames';

type NotificationType = 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  message: '',
};

const Notification: React.FC<{
  type: NotificationType;
  onCloseClick: React.MouseEventHandler<HTMLButtonElement>;
} & React.HTMLProps<HTMLDivElement>> = ({ type, onCloseClick, className, ...rest }) => {
  function getContentForType() {
    switch (type) {
      case 'success':
        return {
          classes: {
            pill: 'bg-orange-300 text-orange-800',
            close: 'hover:bg-orange-200 active:bg-orange-400',
          },
          text: 'Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.',
        };
      case 'error':
        return {
          classes: {
            pill: 'bg-red-300 text-red-800',
            close: 'hover:bg-red-200 active:bg-red-400',
          },
          text: 'Da ist etwas schief gegangen. Bitte versuche es nochmals!',
        };
    }
  }

  const { classes, text } = getContentForType();
  return (
    <div
      className={cx('px-4 py-2 leading-tight rounded-lg flex items-center', classes.pill, className)}
      role="alert"
      {...rest}
    >
      <span className="font-semibold text-left flex-auto">{text}</span>
      <IconButton
        className={cx('ml-2', classes.close)}
        color="none"
        icon="fa-times"
        title="Schliessen"
        aria-label="Schliessen"
        onClick={onCloseClick}
      />
    </div>
  );
};

function urlEncode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

async function submitForm(values: FormValues): Promise<boolean> {
  try {
    const res = await window.fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncode({
        'form-name': 'contact',
        ...values,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

const ContactMe: React.FC = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>();

  function showNotification(type: NotificationType) {
    setNotificationType(type);
    setTimeout(() => setNotificationType(undefined), 3000);
  }

  async function handleFormSubmit(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    setNotificationType(undefined);
    const successful = await submitForm(values);
    showNotification(successful ? 'success' : 'error');
    setSubmitting(false);
  }

  return (
    <section id="contact" className="bg-gray-900 flex flex-col">
      <div className="relative w-9/12 -mt-20 px-6 py-4 self-center bg-white rounded-lg shadow-xl grid gap-4 md:grid-cols-3 items-start">
        <BulletItem icon="fas fa-location-arrow" title="Location">
          <a
            className="link"
            href="https://www.google.ch/maps?q=Lagerplatz+6+Winterthur"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lagerplatz 6, Winterthur
            <br />
            1. OG – Raum 111
          </a>
        </BulletItem>
        <BulletItem icon="fas fa-at" title="Email">
          <a className="link" href="mailto:vlienhard@gmail.com" target="_blank" rel="noopener noreferrer">
            vlienhard@gmail.com
          </a>
        </BulletItem>
        <BulletItem icon="fas fa-phone" title="Telefon">
          <a className="link" href="tel:+41793952033">
            +41 79 395 20 33
          </a>
        </BulletItem>
      </div>
      <div className="container mx-auto px-8 pb-20 pt-24">
        <div className="-mt-12 -ml-12 flex flex-wrap">
          {notificationType && (
            <Notification
              className="w-full mt-12 ml-12"
              type={notificationType}
              onCloseClick={() => setNotificationType(undefined)}
            />
          )}
          <p className="w-64 flex-auto mt-12 ml-12 text-5xl text-white font-semibold leading-tight">
            Ich freue mich auf
            <span className="text-orange-500"> deine Nachricht!</span>
          </p>
          <Formik<FormValues> initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ isSubmitting, isValid }) => (
              <Form
                className="flex-1 flex-grow-5 mt-8 ml-8 flex flex-wrap items-start content-center"
                name="contact"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                <div className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </div>
                <FormField
                  className="w-56 ml-4 mt-4 flex-auto"
                  label={<span className="text-white font-semibold">Name</span>}
                  icon="fas fa-user"
                  error={<ErrorMessage name="name" />}
                  control={
                    <Field
                      className="form-input w-full"
                      type="text"
                      name="name"
                      validate={makeValidator('Name')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  className="w-56 ml-4 mt-4 flex-auto"
                  label={<span className="text-white font-semibold">Email</span>}
                  icon="fas fa-envelope"
                  error={<ErrorMessage name="email" />}
                  control={
                    <Field
                      className="form-input w-full"
                      type="email"
                      name="email"
                      validate={makeValidator('Email')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  className="w-full ml-4 mt-4"
                  label={<span className="text-white font-semibold">Nachricht</span>}
                  error={<ErrorMessage name="message" />}
                  control={
                    <Field
                      className="form-textarea w-full"
                      as="textarea"
                      name="message"
                      placeholder="Wie kann ich dir helfen?"
                      validate={makeValidator('Nachricht')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <Button
                  className="ml-4 mt-4"
                  type="submit"
                  color="orange"
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                >
                  Senden
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
