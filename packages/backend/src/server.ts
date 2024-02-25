import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';
import { initializeApp } from 'firebase/app';
import { graphqlHTTP } from 'express-graphql';
import fs from 'fs';

import AppRouter from './routes';
import { corsConfig } from './config/cors.config';
import db from './config/database.config';
import { queueService } from './queue/bull';
import { initRedis } from './cache/redis';
import { firebaseConfig } from './config/firebase.config';
import { userRoot, userSchema } from './graphql/user.schema';
import { initIndices } from './db';
import { postRoot, postSchema } from './graphql/post.schema';

const app = express();
const router = new AppRouter(app);
const graphqlFolder = 'src/graphql';

app.use(cors(corsConfig));
app.set('port', process.env.PORT || 4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(
  '/graphql/user',
  graphqlHTTP({
    schema: userSchema,
    rootValue: userRoot,
    graphiql: true
  })
);
app.use(
  '/graphql/post',
  graphqlHTTP({
    schema: postSchema,
    rootValue: postRoot,
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
  fs.readdir(graphqlFolder, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }
    files.forEach((file) => {
      const name = file.split('.')[0];
      console.log(`GraphQL for ${name} http://localhost:${port}/graphql/${name}`);
    });
  });
});

export default server;
