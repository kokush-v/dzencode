import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { queueService } from '../../queue/bull';
import { IUserSchema, UserSchema } from '../../schemas/user.schema';
import QUEUES from '../../queue/list';
import { redisClient } from '../../cache/redis';

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
        const cache = await redisClient().get(email);

        let user: IUserSchema;

        const findUserJob = await queueService.addJob(QUEUES.FIND_USER, { email });
        user = await findUserJob.finished();

        if (cache) {
          user = UserSchema.parse(JSON.parse(cache));
        } else {
          queueService.addJob(QUEUES.CACHE_DATA, user);
        }

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const comparePasswordsJob = await queueService.addJob(QUEUES.COMPARE_PASSWORDS, {
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
