import conn from './connection'
import { DbError } from '../utils';

interface PlayerRecord { 
  roomId: number,
  playerId: number,
  buyIn: number, // the number of buy-ins
  cashOut: number, // the number of cash-outs
  chipsAmount: number // the amount of chips
}

export function addPlayerRecord(roomId: number, playerId: number): Promise<string | DbError> {
  return conn.pool.connect()
    .then(client => {
      return client
        .query("INSERT INTO player_records(room_id, player_id, buy_in, cash_out, chips_amount) VALUES ($1, $2, $3, $4, $5);", [roomId, playerId, 1, 0, 0])
        .then(res => {
          console.log(res);
          client.release();
          if (res.rowCount == 1) {
            return "DONE";
          } else {
            return new DbError(`failed to insert player record for room id: ${roomId} and player ${playerId}`)
          }
        })
        .catch(error => {
          console.log(`failed to insert player record for room id: ${roomId} and player ${playerId}`);
          client.release();
          return new DbError(error.message);
        })
    });
}

/**
 * retreive a list of players
 * @param page the page number, starting with index of 1
 * @param limit the limited number of players per pages
 * 
 * e.g., page = 1, limit = 5, it lists the first 5 players.
 *       page = 2, limit = 5, it lists the second 5 players.
 */
export function listPlayerRecords(roomId: number): Promise<any[] | DbError> {
  console.log(`SELECT * FROM player_records WHERE room_id = ${roomId};`)
  return conn.pool.connect()
    .then(client => {
      return client.query("SELECT * FROM player_records WHERE room_id = $1;", [roomId])
        .then(res => {
          client.release();
          return res.rows;
        })
        .catch(error => {
          client.release();
          console.error(error.message);
          return new DbError(error.message);
        });
    });
}

function updateRecord(roomId: number, playerId: number, updatedField: string, updatedValue: number) {
  const sql = `UPDATE player_records SET ${updatedField} = $1 WHERE room_id = $2 AND player_id = $3;`
  return conn.pool.connect()
    .then(client => {
      return client.query(sql, [updatedValue, roomId, playerId])
        .then(res => {
          client.release();
          console.log(res)
          if (res.rowCount == 1) {
            return "DONE";
          } else {
            return new DbError(`failed to update ${updatedField} with ${updatedValue} for room id ${roomId} and player id ${playerId}`);
          }
        })
        .catch(error => {
          client.release();
          console.error(error.message);
          return new DbError(error.message);
        });
    });
}

export function updateBuyIn(roomId: number, playerId: number, buyIn: number): Promise<string|DbError> {
  return updateRecord(roomId, playerId, "buy_in", buyIn);
}

export function updateCashOut(roomId: number, playerId: number, cashOut: number): Promise<string|DbError> {
  return updateRecord(roomId, playerId, "cash_out", cashOut);
}

export function updateChipsAmount(roomId: number, playerId: number, chipsAmount: number): Promise<string|DbError> {
  return updateRecord(roomId, playerId, "chips_amount", chipsAmount);
}