declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
      CLIENT_URL: string;
      BACK_URL: string;
      ELASTIC_ENDPOINT: string;
      ELASTIC_API_KEY_ID: string;
      ELASTIC_API_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
