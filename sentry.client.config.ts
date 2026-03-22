import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a764d6aa1d66b9258b4cb094becdcb8e@o4507537249927168.ingest.de.sentry.io/4507537257922640",

  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
      isNameRequired: false,
      isEmailRequired: false,
      buttonLabel: "Report a Bug",
      submitButtonLabel: "Send Feedback",
      formTitle: "Help us improve CS-Arena",
      autoInject: true,
      showBranding: false,
    }),
  ],

  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});