import * as express from "express";
import * as db from "../db/index";
import PromiseRouter from "express-promise-router";
import { DONE } from "../utils";

const PlayerRecordsRouter = PromiseRouter({
  caseSensitive: true,
  strict: true,
});

interface AddPlayerRequest extends express.Request {
  roomId: number;
  playersId: [number];
}

interface ListPlayerByRoomIdBody {
  roomId: number;
}

interface updatePlayerRecordRequest {
  roomId: number;
  playerId: number;
  updatedValue: number;
}

const listPlayerRecordsByRoomId = async (
  req: express.Request,
  res: express.Response
) => {
  const { roomId } = req.query as unknown as ListPlayerByRoomIdBody;
  db.listPlayerRecords(roomId)
    .then((records) => {
      res.send(records);
    })
    .catch((error) => {
      res.status(404);
      res.send("no records found");
    });
};

const addPlayers = async (req: express.Request, res: express.Response) => {
  const { roomId, playersId } = req.body as unknown as AddPlayerRequest;
  const rst = playersId.map((id: number) => {
    return db.addPlayerRecord(roomId, id);
  });
  Promise.all(rst).then((resolve) => {
    const error = resolve.filter((item) => item != DONE);
    if (error.length == 0) {
      res.send(DONE);
    } else {
      console.log(error);
      res.status(406);
      res.send("invalid room id or player id");
    }
  });
};

const updateBuyIn = async (req: express.Request, res: express.Response) => {
  const { roomId, playerId, updatedValue } =
    req.body as unknown as updatePlayerRecordRequest;
  db.updateBuyIn(roomId, playerId, updatedValue)
    .then((rst) => {
      if (rst != DONE) {
        console.log(rst);
        res.status(406);
        res.send("failed to update value!");
      } else {
        res.send(DONE);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(406);
      res.send("invalid room id or player id");
    });
};

const updateCashOut = async (req: express.Request, res: express.Response) => {
  const { roomId, playerId, updatedValue } =
    req.body as unknown as updatePlayerRecordRequest;
  db.updateCashOut(roomId, playerId, updatedValue)
    .then((rst) => {
      if (rst != DONE) {
        console.log(rst);
        res.status(406);
        res.send("failed to update value!");
      } else {
        res.send(DONE);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(406);
      res.send("invalid room id or player id");
    });
};

const updateChipsAmount = async (
  req: express.Request,
  res: express.Response
) => {
  const { roomId, playerId, updatedValue } =
    req.body as unknown as updatePlayerRecordRequest;
  db.updateChipsAmount(roomId, playerId, updatedValue)
    .then((rst) => {
      if (rst != DONE) {
        console.log(rst);
        res.status(406);
        res.send("failed to update value!");
      } else {
        res.send(DONE);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(406);
      res.send("invalid room id or player id");
    });
};

PlayerRecordsRouter.get("/", listPlayerRecordsByRoomId);
PlayerRecordsRouter.post("/add", addPlayers);
PlayerRecordsRouter.post("/update/buyin", updateBuyIn);
PlayerRecordsRouter.post("/update/cashout", updateCashOut);
PlayerRecordsRouter.post("/update/chips", updateChipsAmount);

export default PlayerRecordsRouter;
