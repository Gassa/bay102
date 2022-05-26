
interface Error {
  msg: string
}

export class DbError extends Error { };

export const DONE = "DONE";