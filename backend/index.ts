import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as path from 'path';
import { mountRouters } from './routers'
import { ApolloServer } from 'apollo-server-express';
import { setupGraphQLServer } from './graphql'

async function main() {
  dotenv.config();

  const app: Express = express();
  const port = process.env.PORT;

  app.use(express.static(path.join(__dirname + './../../frontend/build')));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  mountRouters(app);
  const graphql = await setupGraphQLServer()
  graphql.applyMiddleware({ app })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + './../../frontend/build/index.html'))
  })

  const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
  });

  process.on('SIGTERM', () => {
    console.log(`terimating server on ${port}`);
    server.close();
  })

}

void main()