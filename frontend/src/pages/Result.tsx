import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { computeTransfer } from '../utils/helper'

export type PlayerRecord = { [key: string]: string | number }


type PlayerRecordMap = { [key: number]: PlayerRecord }

interface Player {
  id: number,
  name: string
}

interface Record {
  room_id: string,
  player_id: number,
  buy_in: number,
  cash_out: number,
  chips_amount: number,
  balance: number
}

export default function Result() {
  const { roomId } = useParams();
  const [records, setRecords] = React.useState<PlayerRecordMap>({});
  const calculateBalance = (cashOut: number, buyIn: number, amount: number) => { 
    const b = cashOut - buyIn;
    return (b * 500) + amount; 
  }

  const checkBalance = () => {
    const totalWin = Object.values(records).filter(r => r.balance > 0).map(r => r.balance as number).reduce((acc, cur) => { return acc + cur}, 0)
    const totalLost = Object.values(records).filter(r => r.balance < 0).map(r => r.balance as number).reduce((acc, cur) => { return acc + cur}, 0)
    return { totalWin: totalWin, totalLost: totalLost * (-1)};
  }

  React.useEffect(() => {
    axios('/backend/players').then(res => {
      const result1 = res.data.reduce((acc: { [key: number]: string }, cur: Player) => { return Object.assign(acc, { [cur.id]: cur.name }) }, {}) 
      axios(`/backend/records?roomId=${roomId}`).then(res => {
        const result2: PlayerRecordMap = res.data.reduce((acc: { [key: number]: PlayerRecord }, item: Record) => {
          return Object.assign(acc, { 
            [item.player_id]: { 
              "player_id": item.player_id, 
              "player_name": result1[item.player_id], 
              "buy_in": item.buy_in, 
              "cash_out": item.cash_out, 
              "chips_amount": item.chips_amount,
              "balance": calculateBalance((item.cash_out as number), (item.buy_in as number), (item.chips_amount as number)) 
            } })
        }, {})
        setRecords(result2); 
      })
    })
    .catch(rejected => {
      console.log(rejected);
    })
  }, [roomId]);

  const { totalWin, totalLost } = checkBalance();
  const transfer = computeTransfer(Object.values(records));
  return (
    <>
    <List>
      {Object.values(records!).map((item: PlayerRecord) => (
        <React.Fragment key={item.player_id}>
          <ListItem>
            <ListItemText 
              primary={item.player_name} 
              secondary={`Result: ${(item.cash_out as number) - (item.buy_in as number)} * 500 + ${item.chips_amount} = ${item.balance}`} 
            />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
    <Box>
        Total winning amount: {totalWin}, Total lost amount: {totalLost}
    </Box>
    <List>
      {
        transfer.map((t: string) => (
          <ListItem>
            <ListItemText primary={t} />
          </ListItem>
      ))}
    </List>
    </>
  )
}