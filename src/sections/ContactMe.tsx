import styled from '@emotion/styled';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import Button from '../components/bulma/Button';
import { Container, Section } from '../components/bulma/Page';
import { FormField, HorizontalField } from '../components/bulma/Forms';
import { Title } from '../components/bulma/Heading';
import FindMe from '../components/FindMe';
import { makeValidator } from '../utils/forms';
import { parallax } from '../utils/styles';

type NotificationType = 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const ParallaxSection = styled(Section)(parallax(true), {
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
      render={({ isSubmitting }) => (
        <ParallaxSection id="contact">
          <Container>
            <Title text="So findest du mich" size={1} className="has-text-light has-text-centered" />
            <FindMe />
            {notificationType && (
              <Notification type={notificationType} onCloseClick={() => setNotificationType(undefined)} />
            )}
            <Form name="contact" data-netlify="true" netlify-honeypot="bot-field">
              <div className="is-hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>
              <HorizontalField>
                <FormField
                  label={<span className="has-text-light">Name</span>}
                  icon="fas fa-user"
                  error={<ErrorMessage name="name" />}
                  control={
                    <Field
                      className="input"
                      type="text"
                      name="name"
                      validate={makeValidator('Name')}
                      disabled={isSubmitting}
                    />
                  }
                />
                <FormField
                  label={<span className="has-text-light">Email</span>}
                  icon="fas fa-envelope"
                  error={<ErrorMessage name="email" />}
                  control={
                    <Field
                      className="input"
                      type="email"
                      name="email"
                      validate={makeValidator('Email')}
                      disabled={isSubmitting}
                    />
                  }
                />
              </HorizontalField>
              <FormField
                label={<span className="has-text-light">Nachricht</span>}
                error={<ErrorMessage name="message" />}
                control={
                  <Field
                    className="textarea"
                    as="textarea"
                    name="message"
                    placeholder="Wie kann ich dir helfen?"
                    validate={makeValidator('Nachricht')}
                    disabled={isSubmitting}
                  />
                }
              />
              <Button type="submit" text="Senden" intent="primary" loading={isSubmitting} disabled={isSubmitting} />
            </Form>
          </Container>
        </ParallaxSection>
      )}
    />
  );
};

export default ContactMe;
