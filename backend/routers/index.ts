import { Express } from 'express';
import room from './room';
import player from './player';
import record from './records'

export const mountRouters = (app: Express) => {
  app.use('/backend/rooms', room);
  app.use('/backend/players', player);
  app.use('/backend/records', record);
}

