import styled from '@emotion/styled';
import { Field, Form, Formik, FormikActions } from 'formik';
import React, { useState } from 'react';
import { FormField, HorizontalField, SubmitButton } from '../components/bulma/Forms';
import { Title } from '../components/bulma/Heading';
import FindMe from '../components/FindMe';
import { parallax } from '../utils/styles';

export type NotificationType = 'success' | 'error';

export interface FormValues {
  name: string;
  email: string;
  message: string;
}

const Layout = styled.section(parallax(true), {
  backgroundImage: `url(${require('../images/sunrise.jpg')})`,
});

const initialValues: FormValues = {
  name: '',
  email: '',
  message: '',
};

const Notification: React.FC<{ type: NotificationType; onCloseClick: React.MouseEventHandler<HTMLButtonElement> }> = ({
  type,
  onCloseClick,
}) => {
  switch (type) {
    case 'success':
      return (
        <div className="notification is-primary">
          <button className="delete" onClick={onCloseClick} />
          Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.
        </div>
      );
    case 'error':
      return (
        <div className="notification is-danger">
          <button className="delete" onClick={onCloseClick} />
          Da ist etwas schief gegangen. Bitte versuche es nochmals!
        </div>
      );
  }
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

const validate = (value: string) => (value.length === 0 ? 'Required' : undefined);

const ContactMe: React.FC = () => {
  const [notificationType, setNotificationType] = useState<NotificationType | undefined>(undefined);

  function showNotification(type: NotificationType) {
    setNotificationType(type);
    setTimeout(() => setNotificationType(undefined), 3000);
  }

  async function handleFormSubmit(values: FormValues, { setSubmitting }: FormikActions<FormValues>) {
    setNotificationType(undefined);
    const successful = await submitForm(values);
    showNotification(successful ? 'success' : 'error');
    setSubmitting(false);
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      render={({ errors, isSubmitting }) => (
        <Layout id="contact" className="section">
          <div className="container">
            <Title text="So findest du mich" size={1} className="has-text-light has-text-centered" />
            <FindMe />
            {notificationType && (
              <Notification type={notificationType} onCloseClick={() => setNotificationType(undefined)} />
            )}
            <Form name="contact" data-netlify="true" netlify-honeypot="bot-field">
              <div className="is-none">
                <label>
                  Don’t fill this out if you're human: <input name="bot-field" />
                </label>
              </div>
              <HorizontalField>
                <FormField
                  icon="fas fa-user"
                  error={errors.name}
                  control={
                    <Field
                      className="input"
                      aria-label="Name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      validate={validate}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  icon="fas fa-envelope"
                  error={errors.email}
                  control={
                    <Field
                      className="input"
                      aria-label="Email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      validate={validate}
                      disabled={isSubmitting}
                    />
                  }
                />
              </HorizontalField>
              <FormField
                error={errors.message}
                control={
                  <Field
                    className="textarea"
                    aria-label="Nachricht"
                    component="textarea"
                    name="message"
                    placeholder="Wie kann ich dir helfen?"
                    validate={validate}
                    disabled={isSubmitting}
                  />
                }
              />
              <SubmitButton text="Senden" submitting={isSubmitting} />
            </Form>
          </div>
        </Layout>
      )}
    />
  );
};

export default ContactMe;
