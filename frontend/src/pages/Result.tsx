import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { computeTransfer } from "../utils/helper";
import * as _ from "lodash";

import { PlayerRecord, RawRecord, Player } from '../models'

export default function Result() {
  const { roomId } = useParams();
  const [records, setRecords] = React.useState<PlayerRecord[]>([]);

  const checkBalance = () => {
    const totalWin = _.map(
      _.filter(records, (r: PlayerRecord) => r.balance > 0),
      (item: PlayerRecord) => item.balance as number
    ).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
    const totalLost = _.map(
      _.filter(records, (r: PlayerRecord) => r.balance < 0),
      (item: PlayerRecord) => item.balance as number
    ).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
    return { totalWin: totalWin, totalLost: totalLost * -1 };
  };

  React.useEffect(() => {
    axios("/backend/players")
      .then((res) => {
        const result1 = _.mapValues(
          _.keyBy<Player>(res.data, "id"),
          (cur: Player) => { return cur.name; }
        );
        axios(`/backend/records?roomId=${roomId}`).then((res) => {
          const result2 = _.map(res.data, (item: RawRecord) => {
            return new PlayerRecord(
              item.room_id,
              item.player_id,
              result1[item.player_id],
              item.buy_in,
              item.cash_out,
              item.chips_amount,
              (item.cash_out - item.buy_in) * 500 + item.chips_amount
            );
          });
          setRecords(result2);
        });
      })
      .catch((rejected) => {
        console.log(rejected);
      });
  }, [roomId]);

  const { totalWin, totalLost } = checkBalance();
  const transfer = computeTransfer(records);

  return (
    <>
      <List>
        {_.map(records, (item: PlayerRecord) => {
          return (
            <ListItem key={item.player_id}>
              <ListItemText
                primary={item.player_name}
                secondary={`Result: ${item.cash_out - item.buy_in} * 500 + 
                ${ item.chips_amount } = 
                ${(item.cash_out - item.buy_in) * 500 + item.chips_amount}`}
              />
            </ListItem>
          );
        })}
      </List>
      <Box>
        Total winning amount: {totalWin}, Total lost amount: {totalLost}
      </Box>
      <List>
        {_.map(transfer, (value: string, idx: number) => {
          return (
            <ListItem key={idx}>
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
