// Local storage keys
export const STORAGE_KEYS = {
  JWT_TOKEN_STUDENT: 'JWT_TOKEN_STUDENT',
  JWT_TOKEN_INSTRUCTOR: 'JWT_TOKEN_INSTRUCTOR',
  ADDRESS: 'ADDRESS',
  AUTH_TOKEN: 'AUTH-TOKEN'
};

// React-query keys
export const QUERY_KEYS = {
  POSTS: 'posts',
  USER: 'user',
  FILTER: 'filter'
};

// Backend Routes
export const BACKEND_KEYS = {
  SERVER_URL: 'http://127.0.0.1:4200',
  POSTS: {
    ROOT: 'post',
    CREATE: 'post/create',
    UPDATE: (postId?: number) => `post/update/${postId}`,
    DELETE: (postId?: number) => `post/delete/${postId}`
  },
  AUTH: {
    REG: 'user/register',
    LOGIN: 'user/login',
    LOGOUT: 'user/login',
    REQ_RESET_PASS: 'user/request-reset-password',
    RESET_PASS: 'user/reset-password',
    USER: 'user'
  }
};

export const ROUTER_KEYS = {
  HOME: '/home',
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    SIGN_UP: '/auth/register'
  }
};

export const ERRORS = {
  USER_EXIST: 'User already exist',
  USER_NOT_EXIST: 'User not exist, create account',
  INCORRECT_PASSWORD: 'Incorrect password',
  UNAUTHORIZED: 'Please login'
};
