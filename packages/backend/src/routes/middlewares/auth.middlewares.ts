import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';

import { IUserSchema, UserSchema } from '../../schemas/user.schema';
import QUEUE from '../../queue/list';
import { queue } from '../../config/bull.config';
import { getRedisClient } from '../../config/redis.config';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(opts, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const redisClient = await getRedisClient();

        let user: IUserSchema;
        const cache = await redisClient.get(email);

        const findUserJob = await queue.add(QUEUE.FIND_USER, { email });
        user = await findUserJob.finished();

        if (cache) {
          user = UserSchema.parse(JSON.parse(cache));
        } else {
          queue.add(QUEUE.CACHE_DATA, user);
        }

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const comparePasswordsJob = await queue.add(QUEUE.COMPARE_PASSWORDS, {
          password,
          userPassword: user.password
        });
        const validate: boolean = await comparePasswordsJob.finished();

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export const localStrategy = passport.authenticate('login', { session: false });
