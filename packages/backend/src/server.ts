import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';
import { initializeApp } from 'firebase/app';
import { graphqlHTTP } from 'express-graphql';

import AppRouter from './routes';
import { corsConfig } from './config/cors.config';
import db from './config/database.config';
import { queueService } from './queue/bull';
import { initRedis } from './cache/redis';
import { firebaseConfig } from './config/firebase.config';
import { root, schema } from './graphql/schema';
import { initIndices } from './db';

const app = express();
const router = new AppRouter(app);

app.use(cors(corsConfig));
app.set('port', process.env.PORT || 4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

router.init();

const port = app.get('port');
const server = app.listen(port, async () => {
  db.info()
    .then(async ({ cluster_uuid }) => {
      console.log(`Db connected ID: ${cluster_uuid}`);
      await initIndices();
    })
    .catch((err) => console.log(`Db connection err: ${err}`));
  await initRedis();
  await queueService.initService();
  initializeApp(firebaseConfig);
  console.log('Firebase connected');

  console.log(`Server started on port ${port}`);
  console.log(`GrapgQl started on port http://localhost:${port}/graphql`);
});

export default server;
