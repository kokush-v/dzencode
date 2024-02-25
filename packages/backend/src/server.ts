import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';
import { initializeApp } from 'firebase/app';
import multer from 'multer';

import AppRouter from './routes';
import { corsConfig } from './config/cors.config';
import db from './config/database.config';
import { queueService } from './queue/bull';
import { initRedis } from './cache/redis';
import { firebaseConfig } from './config/firebase.config';

export const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const router = new AppRouter(app);

app.use(cors(corsConfig));
app.set('port', process.env.PORT || 4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

router.init();

const port = app.get('port');
// eslint-disable-next-line no-console
const server = app.listen(port, async () => {
  db.info()
    .then(({ cluster_uuid }) => console.log(`Db connected ID: ${cluster_uuid}`))
    .catch((err) => console.log(`Db connection err: ${err}`));
  await initRedis();
  await queueService.initService();
  initializeApp(firebaseConfig);
  console.log('Firebase connected');

  console.log(`Server started on port ${port}`);
});

export default server;
