import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Button } from '../common/components/Button';
import { BotField } from '../common/components/Forms';
import Notification, { NotificationType } from '../common/components/Notification';
import { makeValidator, urlEncode } from '../common/utils/forms';

interface FormValues {
  name: string;
  email: string;
  videos: string[];
  message: string;
}

interface Video {
  title: string;
  status: 'available' | 'soon';
}

const availableVideos: Video[] = [
  {
    title: "Yoga 1 - ganzheitliches Training 60' (Abfolge Di/Mi-Gruppe)",
    status: 'available',
  },
  {
    title: "Yoga 2 - ganzheitliches Training 60' (Abfolge Fr/Sa-Gruppe)",
    status: 'available',
  },
  {
    title: "Yoga 3 - 30' Kurz-Yoga (Rotationen und Hüftöffner)",
    status: 'available',
  },
  {
    title: "Yoga 4 - 40' Yoga-Flow (Sonnengruss-Varianten, tanzender Krieger)",
    status: 'available',
  },
  {
    title: "Yoga 5 - 30' ruhige Abfolge zum Abschalten",
    status: 'available',
  },
  {
    title: "CoreXtreme - 20' intensives Rumpftraining",
    status: 'available',
  },
  {
    title: 'Boost 1 - funktionelles Krafttraining mit dem eigenen Körpergewicht',
    status: 'available',
  },
];

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
        videos: videos.join(', '),
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

const Current: React.FC = () => {
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
    <section id="current" className="bg-gray-900">
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
              <fieldset>
                <legend className="text-white form-label">Videos</legend>
                <ul className="-mt-1 text-white">
                  {availableVideos.map(video => (
                    <li key={video.title} className="mt-2">
                      <label className="inline-flex items-center">
                        <Field
                          className="form-checkbox"
                          type="checkbox"
                          name="videos"
                          value={video.title}
                          disabled={isSubmitting}
                        />
                        <span className="ml-2 text-sm">{video.title}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <label className="mt-4 flex-auto form-field">
                <span className="form-label text-white">
                  Dein Wunschtraining ist noch nicht auf der Liste? Beschreibe was du dir wünschst!
                </span>
                <Field className="form-textarea h-full" as="textarea" name="message" disabled={isSubmitting} />
                <ErrorMessage name="message">{error => <span className="form-error">{error}</span>}</ErrorMessage>
              </label>
              <div className="-ml-4 flex flex-wrap">
                <label className="w-64 ml-4 mt-4 flex-auto form-field">
                  <span className="form-label text-white">Name</span>
                  <Field
                    className="form-input"
                    type="text"
                    name="name"
                    validate={makeValidator('Name')}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="name">{error => <span className="form-error">{error}</span>}</ErrorMessage>
                </label>
                <label className="w-64 ml-4 mt-4 flex-auto form-field">
                  <span className="form-label text-white">Email</span>
                  <Field
                    className="form-input"
                    type="email"
                    name="email"
                    validate={makeValidator('Email')}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="email">{error => <span className="form-error">{error}</span>}</ErrorMessage>
                </label>
              </div>
              <Button
                className="mt-4 self-start"
                type="submit"
                color="orange"
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
    </section>
  );
};

export default Current;
