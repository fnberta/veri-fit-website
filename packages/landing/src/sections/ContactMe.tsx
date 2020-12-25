import { Form, Formik, FormikConfig } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import {
  BotField,
  Button,
  FieldControl,
  InputField,
  makeValidator,
  TextAreaField,
  urlEncode,
} from '@veri-fit/common-ui';
import Notification, { NotificationType } from '../Notification';
import BulletItem from './BulletItem';

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

const ContactMe: FC = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>();

  useEffect(() => {
    const timeoutId = notificationType ? window.setTimeout(() => setNotificationType(undefined), 3000) : undefined;
    return () => clearTimeout(timeoutId);
  }, [notificationType]);

  const handleFormSubmit: FormikConfig<FormValues>['onSubmit'] = async (values) => {
    setNotificationType(undefined);
    const successful = await submitForm(values);
    setNotificationType(successful ? 'success' : 'error');
  };

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
                <FieldControl className="w-64 ml-4 mt-4 flex-auto" name="name">
                  <InputField
                    type="text"
                    validate={makeValidator('Name')}
                    disabled={isSubmitting}
                    label="Name"
                    dark={true}
                  />
                </FieldControl>
                <FieldControl className="w-64 ml-4 mt-4 flex-auto" name="email">
                  <InputField
                    type="email"
                    validate={makeValidator('Email')}
                    disabled={isSubmitting}
                    label="Email"
                    dark={true}
                  />
                </FieldControl>
                <FieldControl className="w-full ml-4 mt-4" name="message">
                  <TextAreaField
                    label="Nachricht"
                    placeholder="Wie kann ich dir helfen?"
                    validate={makeValidator('Nachricht')}
                    disabled={isSubmitting}
                    dark={true}
                  />
                </FieldControl>
                <Button
                  className="ml-4 mt-4"
                  type="submit"
                  colorScheme="orange"
                  loading={isSubmitting}
                  disabled={!isValid}
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
