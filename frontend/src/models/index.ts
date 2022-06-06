
export class PlayerRecord {
  room_id: number;
  player_id: number;
  buy_in: number;
  cash_out: number;
  chips_amount: number;
  balance: number;
  player_name: string;
  aplace_holder: string;

  constructor(
    room_id: number,
    player_id: number,
    player_name: string,
    buy_in: number,
    cash_out: number,
    chips_amount: number,
    balance: number
  ) {
    this.room_id = room_id;
    this.player_id = player_id;
    this.player_name = player_name;
    this.buy_in = buy_in;
    this.cash_out = cash_out;
    this.chips_amount = chips_amount;
    this.balance = balance;
    this.aplace_holder = "";
  }
}

export interface Player {
  id: number;
  name: string;
}

export interface RawRecord {
  room_id: number;
  player_id: number;
  buy_in: number;
  cash_out: number;
  chips_amount: number;
}