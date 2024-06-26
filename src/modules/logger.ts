import pino from 'pino';

function getLogger() {
  if (['preview', 'production'].includes(process.env.APP_ENV)) {
    const pinoLogger = pino({
      base: {
        environment: process.env.APP_ENV
      },
      nestedKey: 'payload',
      redact: [
        'headers.cookie',
        'password',
        'email',
        'body.password',
        'body.email',
        'user.password',
        'user.email',
        'session.token'
      ]
    });

    return pinoLogger;
  }

  const consoleLogger = {
    trace: console.trace,
    debug: console.debug,
    info: ignore,
    warn: console.warn,
    error: console.error,
    fatal: console.error
  };

  if (process.env.LOG_LEVEL === 'info') {
    consoleLogger.info = console.log;
  }

  return consoleLogger;
}

function ignore() {}

export default getLogger();
