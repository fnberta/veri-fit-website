import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import BulletItem from '../components/BulletItem';
import { Button } from '../components/Button';
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
          classes: 'bg-orange-500 text-orange-800',
          text: 'Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.',
        };
      case 'error':
        return {
          classes: 'bg-red-500 text-red-800',
          text: 'Da ist etwas schief gegangen. Bitte versuche es nochmals!',
        };
    }
  }

  const { classes, text } = getContentForType();
  return (
    <div
      className={cx('px-4 py-2 leading-none rounded-full flex items-center', classes, className)}
      role="alert"
      {...rest}
    >
      <span className="font-semibold text-left flex-auto">{text}</span>
      <button className="ml-2 btn btn-medium" aria-label="Schliessen" onClick={onCloseClick}>
        <span className="fas fa-times" />
      </button>
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
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      render={({ isSubmitting, isValid }) => (
        <section id="contact" className="bg-gray-900 flex flex-col">
          <div className="relative w-9/12 -mt-20 p-6 self-center bg-white rounded-lg shadow-xl grid gap-4 md:grid-cols-3 items-start">
            <BulletItem icon="fas fa-location-arrow" title="Location">
              Lagerplatz 6, Winterthur
              <br />
              1. OG – Raum 111
            </BulletItem>
            <BulletItem icon="fas fa-at" title="Email">
              <a className="link" href="mailto:vlienhard@gmail.com" target="_blank" rel="noopener noreferrer">
                vlienhard@gmail.com
              </a>
            </BulletItem>
            <BulletItem icon="fas fa-phone" title="Telefon">
              +41 79 395 20 33
            </BulletItem>
          </div>
          <div className="container mx-auto px-8 py-20 grid gap-12 md:grid-cols-5 items-start">
            {notificationType && (
              <Notification
                className="md:col-span-5"
                type={notificationType}
                onCloseClick={() => setNotificationType(undefined)}
              />
            )}
            <p className="md:col-span-2 text-6xl text-white font-semibold leading-tight">
              Ich freue mich auf <br />
              <span className="text-orange-500">deine Nachricht!</span>
            </p>
            <Form
              className="md:col-span-3 grid gap-4 md:grid-cols-2 items-start"
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
                className="md:col-span-2"
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
                style={{ justifySelf: 'start' }}
                type="submit"
                color="orange"
                loading={isSubmitting}
                disabled={isSubmitting || !isValid}
              >
                Senden
              </Button>
            </Form>
          </div>
        </section>
      )}
    />
  );
};

export default ContactMe;
