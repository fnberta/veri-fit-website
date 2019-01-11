import styled from '@emotion/styled';
import { Field, Form, Formik, FormikActions } from 'formik';
import React from 'react';
import { FormField, HorizontalField, SubmitButton } from '../components/bulma/Forms';
import Heading from '../components/bulma/Heading';
import FindMe from '../components/FindMe';
import { parallax } from '../utils/styles';

export type NotificationType = 'success' | 'error';

export interface State {
  notificationType?: NotificationType;
}

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

// tslint:disable-next-line:no-any
function urlEncode(data: { [key: string]: any }): string {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

const validate = (value: string) => (value.length === 0 ? 'Required' : undefined);

const Notification: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <div className="notification is-primary">
          <button className="delete" />
          Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.
        </div>
      );
    case 'error':
      return (
        <div className="notification is-danger">
          <button className="delete" />
          Da ist etwas schief gegangen. Bitte versuche es nochmals!
        </div>
      );
  }
};

class ContactMe extends React.Component<{}, State> {
  readonly state: State = {};

  render() {
    const { notificationType } = this.state;
    return (
      <Formik<FormValues>
        initialValues={initialValues}
        onSubmit={this.handleFormSubmit}
        render={({ errors, isSubmitting }) => (
          <Layout id="contact" className="section">
            <div className="container">
              <Heading text="So findest du mich" size={1} className="has-text-light has-text-centered" />
              <FindMe />
              {notificationType && <Notification type={notificationType} />}
              <Form>
                <HorizontalField>
                  <FormField
                    icon="fas fa-user"
                    error={errors.name}
                    control={
                      <Field
                        className="input"
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
  }

  private showNotification(type: NotificationType) {
    this.setState({ notificationType: type });
    setTimeout(() => this.setState({ notificationType: undefined }), 3000);
  }

  private handleFormSubmit = async (values: FormValues, { setSubmitting }: FormikActions<FormValues>) => {
    this.setState({ notificationType: undefined });

    try {
      await window.fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncode({
          'form-name': 'contact',
          ...values,
        }),
      });
      this.showNotification('success');
    } catch {
      this.showNotification('error');
    }

    setSubmitting(false);
  };
}

export default ContactMe;
