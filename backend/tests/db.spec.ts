import { doesNotMatch } from 'assert';
import dotenv from 'dotenv';
import pg from 'pg';


dotenv.config()

const dbUsername = process.env.DB_USERNAME || "me";
const dbPassword = process.env.DB_PASSWORD || "password";
const dbHost = process.env.DB_HOST || "localhost";
const dbHostPort= parseInt(process.env.DB_PORT || "5423");
const dbName = process.env.DB_DATABASE || "default";

describe('db spec', function () {

  test('responds to /', async () => {
    expect('hello world!').toEqual('hello world!');
  }, 1000);


});