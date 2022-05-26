import * as express from 'express';
import * as db from '../db/index';
import PromiseRouter from 'express-promise-router';
import { DONE } from '../utils'

const RoomRouter = PromiseRouter({caseSensitive: true, strict: true});

interface AddRoomRequest extends express.Request {
  name: string,
  password: string
}

interface ListRoomQuery {
  page: number,
  limit: number
}

const listRooms = async (req: express.Request, res: express.Response) => {
  const { page, limit } = req.query as unknown as ListRoomQuery;
  db.listRooms(page, limit)
    .then(rooms => {
      res.send(rooms);
    })
    .catch(error => {
      res.sendStatus(404).send("no rooms found");
    });
}

const addRoom = async (req: express.Request, res: express.Response) => {
  const { name, password } = req.body;
  console.log(`name: ${name}, password: ${password}`);
  db.addRoom(name, password, new Date())
    .then(rst => { 
      if (rst == DONE) {
        res.send("DONE")
      } else {
        res.status(406)
        res.render("failed to create room.")
      }
     });
}

RoomRouter.get('/', listRooms);
RoomRouter.post('/add', addRoom);

export default RoomRouter;