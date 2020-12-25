import React, { FC, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import {
  BotField,
  Button,
  CheckInputField,
  FieldControl,
  InputField,
  makeValidator,
  TextAreaField,
  urlEncode,
} from '@veri-fit/common-ui';
import Notification, { NotificationType } from '../Notification';

export interface Video {
  title: string;
  description: string;
  status: 'available' | 'soon';
}

export interface Props {
  videos: Video[];
}

interface FormValues {
  name: string;
  email: string;
  videos: string[];
  message: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  videos: [],
  message: '',
};

async function submitForm({ videos, ...rest }: FormValues): Promise<boolean> {
  try {
    const res = await window.fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncode({
        'form-name': 'videos',
        ...rest,
        videos: videos.join('; '),
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

const Videos: FC<Props> = ({ videos }) => {
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
    <div className="max-w-screen-xl mx-auto px-8 py-20">
      <header>
        <h1 className="text-5xl text-white font-bold leading-tight">
          Aktuell – <span className="text-orange-500">Training für zu Hause!</span>
        </h1>
        <p className="mt-6 text-xl text-white">
          Wähle deine Wunschtrainings für zu Hause. Du erhältst schnellstmöglich einen Video-Link von mir.
        </p>
      </header>
      <Formik<FormValues> initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form className="mt-8 flex flex-col" name="videos" data-netlify="true" netlify-honeypot="bot-field">
            <BotField />
            <FieldControl name="videos">
              <fieldset>
                <legend className="field-label text-white">Videos</legend>
                <ul className="-mt-1 text-white">
                  {videos.map((video) => {
                    const text = `${video.title} - ${video.description}`;
                    return (
                      <li key={video.title} className="mt-2">
                        <CheckInputField type="checkbox" dark={true} value={text} label={text} />
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </FieldControl>
            <FieldControl className="mt-4 flex-auto" name="message">
              <TextAreaField
                disabled={isSubmitting}
                label="Dein Wunschtraining ist noch nicht auf der Liste? Beschreibe was du dir wünschst!"
                dark={true}
              />
            </FieldControl>
            <div className="-ml-4 flex flex-wrap">
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
            </div>
            <Button
              className="mt-4 self-start"
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
      {notificationType && (
        <Notification
          className="w-full mt-6"
          type={notificationType}
          onCloseClick={() => setNotificationType(undefined)}
        />
      )}
      <p className="mt-6 text-lg text-white">
        Pro Video ziehe ich dir von deinem Abo einen Eintritt ab. Hast du kein Abo, verrechne ich dir einen
        Einzeleintritt (30.-). Bleib gesund und in Bewegung!
      </p>
    </div>
  );
};

export default Videos;
