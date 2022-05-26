import conn from './connection'
import { DbError } from '../utils';

export interface Player {
  id: number,
  name: string
}

export function addPlayer(name: string): Promise<string | DbError> {
  console.log(`INSERT INTO players(name) VALUES ('${name}');`)
  return conn.pool.connect()
    .then(client => {
      return client
        .query("INSERT INTO players(name) VALUES ($1);", [name])
        .then(res => {
          client.release();
          return "DONE";
        })
        .catch(error => {
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
export function listPlayers(page: number = 0, limit: number = 10, all: boolean = false): Promise<any[] | DbError> {
  return conn.pool.connect()
    .then(client => {
      if (all) {
        return client.query("SELECT * FROM players;")
          .then(res => {
            client.release();
            return res.rows;
          })
          .catch(error => {
            client.release();
            console.error(error.message);
            return new DbError(error.message);
          });
      } else {
        return client.query("SELECT * FROM players ORDER BY id OFFSET $1 LIMIT $2;", [(page - 1) * limit, limit])
          .then(res => {
            client.release();
            return res.rows;
          })
          .catch(error => {
            client.release();
            console.error(error.message);
            return new DbError(error.message);
          });
      }
    });
}

export function removePlayers(playerId: number): Promise<string|DbError> {
  return conn.pool.connect()
    .then(client => {
      return client.query("DELETE FROM players WHERE id = $1;", [playerId])
        .then(res => {
          client.release();
          return "DONE";
        })
        .catch(error => {
          client.release();
          console.error(error.message);
          return new DbError(error.message);
        });
    });
}