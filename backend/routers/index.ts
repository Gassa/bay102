import { Express } from 'express';
import room from './room';
import player from './player';
import record from './records'

export const mountRouters = (app: Express) => {
  app.use('/rooms', room);
  app.use('/players', player);
  app.use('/records', record);
}

