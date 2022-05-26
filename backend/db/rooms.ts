import conn from './connection'
import { DbError } from '../utils';

interface Room {
  id: number,
  name: string,
  password: string,
  createAt: Date
}

export function addRoom(name: string, password: string, createAt: Date = new Date()): Promise<string | DbError> {
  return conn.pool.connect()
    .then(client => {
      return client
        .query("INSERT INTO rooms(name, password, created_at) VALUES ($1, $2, $3);", [name, password, createAt])
        .then(res => {
          client.release();
          return "DONE";
        })
        .catch(error => {
          client.release();
          console.log(error.message);
          return new DbError(error.message);
        })
    });
}

export function listRooms(page: number = 0, limit: number = 10, all: boolean = false): Promise<any[] | DbError> {
  return conn.pool.connect()
    .then(client => {
      if (all) {
        return client.query("SELECT * FROM rooms;")
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
        console.log(`SELECT * FROM rooms ORDER BY id OFFSET ${(page-1)*limit} LIMIT ${limit};`)
        return client.query("SELECT * FROM rooms ORDER BY id OFFSET $1 LIMIT $2;", [(page - 1) * limit, limit])
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

export function getRoomPassword(roomId: number): Promise<string | DbError> {
  return conn.pool.connect()
    .then(client => {
      return client.query("SELECT password FROM room WHERE id = $1;", [roomId])
        .then(res => {
          client.release();
          if (res.rowCount == 1) {
            return res.rows[0] as string;
          } else {
            return new DbError(`room: ${roomId} not found`);
          }

        })
        .catch(error => {
          client.release();
          console.error(error.message);
          return new DbError(error.message);
        });
    });
}

