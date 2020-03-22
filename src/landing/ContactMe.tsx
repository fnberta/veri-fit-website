import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import BulletItem from './BulletItem';
import { Button } from '../common/components/Button';
import { BotField, FormField } from '../common/components/Forms';
import { makeValidator, urlEncode } from '../common/utils/forms';
import Notification, { NotificationType } from '../common/components/Notification';

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
      <header>
        <h1 className="sr-only">Kontakt</h1>
      </header>
      <div className="relative w-9/12 -mt-20 p-6 self-center bg-white rounded-lg shadow-xl grid gap-6 md:grid-cols-3 items-start">
        <BulletItem icon="location-marker" title="Location">
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
        <BulletItem icon="at-symbol" title="Email">
          <a className="link" href="mailto:vlienhard@gmail.com" target="_blank" rel="noopener noreferrer">
            vlienhard@gmail.com
          </a>
        </BulletItem>
        <BulletItem icon="phone-outgoing" title="Telefon">
          <a className="link" href="tel:+41793952033">
            +41 79 395 20 33
          </a>
        </BulletItem>
      </div>
      <div className="max-w-screen-xl mx-auto px-8 pb-20 pt-24">
        <div className="-mt-12 -ml-12 flex flex-wrap">
          {notificationType && (
            <Notification
              className="w-full mt-12 ml-12"
              type={notificationType}
              onCloseClick={() => setNotificationType(undefined)}
            />
          )}
          <p className="flex-1 mt-12 ml-12 text-5xl text-white font-semibold leading-tight">
            Ich freue mich auf
            <span className="text-orange-500"> deine Nachricht!</span>
          </p>
          <Formik<FormValues> initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ isSubmitting, isValid }) => (
              <Form
                className="flex-1 flex-grow-2 mt-8 ml-8 flex flex-wrap items-start content-center"
                name="contact"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                <BotField />
                <FormField
                  className="w-64 ml-4 mt-4 flex-auto"
                  label={<span className="text-white font-semibold">Name</span>}
                  htmlFor="name"
                  error={<ErrorMessage name="name" />}
                  control={
                    <Field
                      className="form-input"
                      type="text"
                      id="name"
                      name="name"
                      validate={makeValidator('Name')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  className="w-64 ml-4 mt-4 flex-auto"
                  label={<span className="text-white font-semibold">Email</span>}
                  htmlFor="email"
                  error={<ErrorMessage name="email" />}
                  control={
                    <Field
                      className="form-input"
                      type="email"
                      id="email"
                      name="email"
                      validate={makeValidator('Email')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  className="w-full ml-4 mt-4"
                  label={<span className="text-white font-semibold">Nachricht</span>}
                  htmlFor="message"
                  error={<ErrorMessage name="message" />}
                  control={
                    <Field
                      className="form-textarea"
                      as="textarea"
                      id="message"
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
