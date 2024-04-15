import mongoose from 'mongoose';
import buildApp from './app';
import config from './config';

const fastify = buildApp();
const port = config.serverPort;

mongoose
  .connect(config.databaseUrl, { bufferCommands: false })
  .then(() =>
    fastify.listen({ port, host: '0.0.0.0' }, function (err, address) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Server listening on ${address}`);
    })
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
