declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
      CLIENT_URL: string;
      BACK_URL: string;
      ELASTIC_API_KEY_ID: string;
      ELASTIC_API_KEY: string;
      ELASTIC_CLOUD_ID: string;
      BULL_PORT: number;
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGE_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MESURMENT_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
