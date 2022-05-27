import * as express from 'express';
import * as db from '../db/index';
import PromiseRouter from 'express-promise-router';
import { DONE } from '../utils'

const PlayerRouter = PromiseRouter({caseSensitive: true, strict: true});

interface AddPlayerRequest extends express.Request {
  name: string,
}

interface ListPlayerQuery {
  page: number,
  limit: number
}

const listRooms = async (req: express.Request, res: express.Response) => {
  const { page, limit } = req.query as unknown as ListPlayerQuery;
  db.listPlayers(page, limit, true)
    .then(players => {
      res.send(players);
    })
    .catch(error => {
      console.error(error.message);
      res.status(404)
      res.send("no players found");
    });
}

const addPlayer = async (req: express.Request, res: express.Response) => {
  const { name } = req.body as unknown as AddPlayerRequest;
  db.addPlayer(name )
    .then(rst => { 
      if (rst == DONE) {
        res.send("DONE")
      } else {
        console.log(rst)
        res.status(406);
        res.send("failed to create player.")
      }
     });
}

PlayerRouter.get('/', listRooms);
PlayerRouter.post('/add', addPlayer);

export default PlayerRouter;