import * as Sentry from "@sentry/nextjs";

if (typeof window !== "undefined") {
  Sentry.init({
    dsn: "https://adaa4175f7743dff82fbc63627238807@o4511043734798336.ingest.us.sentry.io/4511043739910144",
    integrations: [
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        colorScheme: "system",
        autoInject: false,
        showBranding: false,
      }),
    ],
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  });
}