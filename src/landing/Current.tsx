import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Button } from '../common/components/Button';
import { BotField } from '../common/components/Forms';
import Notification, { NotificationType } from '../common/components/Notification';
import { makeValidator, urlEncode } from '../common/utils/forms';

interface FormValues {
  name: string;
  email: string;
  videos: boolean[];
  message: string;
}

interface Video {
  title: string;
  status: 'available' | 'soon';
}

const availableVideos: Video[] = [
  {
    title: "Yoga 1 - ganzheitliches Training 60'(Abfolge Di/Mi-Gruppe)",
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
  // {
  //   title: 'Boost 1 - funktionelles Krafttraining mit dem eigenen Körpergewicht',
  //   status: 'soon',
  // },
  {
    title: 'CoreXtreme - 20’ intensives Rumpftraining',
    status: 'available',
  },
];

const initialValues: FormValues = {
  name: '',
  email: '',
  videos: availableVideos.map(() => false),
  message: '',
};

async function submitForm({ videos, ...rest }: FormValues): Promise<boolean> {
  try {
    const titles = [] as string[];
    for (let i = 0; i < videos.length; i++) {
      if (videos[i]) {
        titles.push(availableVideos[i].title);
      }
    }
    const res = await window.fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncode({
        'form-name': 'videos',
        ...rest,
        videos: titles.join(', '),
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
                  {availableVideos.map((video, idx) => {
                    const name = `videos[${idx}]`;
                    return (
                      <li key={video.title} className="mt-2">
                        <div className="form-field">
                          <div className="inline-flex items-center">
                            <Field
                              className="form-checkbox"
                              type="checkbox"
                              id={name}
                              name={name}
                              disabled={isSubmitting}
                            />
                            <label className="ml-2 text-sm" htmlFor={name}>
                              {video.title}
                            </label>
                          </div>
                          <ErrorMessage name={name}>
                            {error => <span className="form-error">{error}</span>}
                          </ErrorMessage>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
              <div className="mt-4 flex-auto form-field">
                <label className="form-label text-white" htmlFor="videos-message">
                  Dein Wunschtraining ist noch nicht auf der Liste? Beschreibe was du dir wünschst!
                </label>
                <Field
                  className="form-textarea h-full"
                  as="textarea"
                  id="videos-message"
                  name="message"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="message">{error => <span className="form-error">{error}</span>}</ErrorMessage>
              </div>
              <div className="-ml-4 flex flex-wrap">
                <div className="w-64 ml-4 mt-4 flex-auto form-field">
                  <label className="form-label text-white" htmlFor="videos-name">
                    Name
                  </label>
                  <Field
                    className="form-input"
                    type="text"
                    id="videos-name"
                    name="name"
                    validate={makeValidator('Name')}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="name">{error => <span className="form-error">{error}</span>}</ErrorMessage>
                </div>
                <div className="w-64 ml-4 mt-4 flex-auto form-field">
                  <label className="form-label text-white" htmlFor="videos-email">
                    Email
                  </label>
                  <Field
                    className="form-input"
                    type="email"
                    id="videos-email"
                    name="email"
                    validate={makeValidator('Email')}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="email">{error => <span className="form-error">{error}</span>}</ErrorMessage>
                </div>
              </div>
              <Button
                className="mt-4 self-start"
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
        {notificationType && (
          <Notification
            className="w-full mt-6"
            type={notificationType}
            onCloseClick={() => setNotificationType(undefined)}
          />
        )}
        <p className="mt-6 text-lg text-white">
          Pro Video ziehe ich dir von deinem Abo einen Eintritt ab. Hast du kein Abo, verrechne ich dir einen
          Einzeleintritt (30.-). Bleib gesund & in Bewegung!
        </p>
      </div>
    </section>
  );
};

export default Current;
