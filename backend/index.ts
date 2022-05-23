import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as path from 'path';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

console.log(__dirname)

app.use(express.static(path.join(__dirname, '../../frontend/build')))

app.get('/backend', (req: Request, res: Response) => {
  // res.send('Express + TypeScript Server');
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../frontend/build/index.html'))
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});