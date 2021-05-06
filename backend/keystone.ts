import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/test';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long should users stay signed in
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // TODO: add data seeding here
  },
  lists: createSchema({
    // TODO: add schema items
  }),
  ui: {
    // TODO: change this for roles
    isAccessAllowed: () => true,
  },
  // TODO: add session values here
});
