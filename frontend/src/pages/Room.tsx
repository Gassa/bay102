import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';

import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { ConfirmationDialogRaw } from './components/InputChipsDialog';

type PlayerRecord = { [key: string]: string | number }


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
  chips_amount: number
}



export default function Room() {
  const { roomId } = useParams();
  const [inputDialogOpen, setInputDialogOpen] = React.useState(false);
  const [dialogPlayerId, setDialogPlayerId] = React.useState(0);
  const [records, setRecords] = React.useState<PlayerRecordMap>({});
  
  const handleBuyIn = (roomId: number, playerId: number, field: string) => {
    console.log(`room: ${roomId}, player: ${playerId} - ${field}`);
    const record = records![playerId];
    const updatedRecord = Object.assign(record, { [field]: (record![field] as number) + 1 })
    const updateRecords = Object.assign(records, { [record.player_id]: updatedRecord })
    axios.post(`/backend/records/update/${field}`,
      { "roomId": roomId, "playerId": playerId, "updatedValue": (record![field] as number) + 1 }
    ).then(res => setRecords({...updateRecords}))
    .catch(rejected => {
      console.log(rejected);
      alert(`failed to update ${field}: ${rejected}`);
    })
  }

  const updateChipsAmount = (roomId: number, playerId: number, amount: number) => {
    console.log(`room: ${roomId}, player: ${playerId}`);
    const record = records![playerId];
    const updatedRecord = Object.assign(record, { "chips_amount": amount })
    const updateRecords = Object.assign(records, { [record.player_id]: updatedRecord })
    axios.post(`/backend/records/update/chips_amount`,
      { "roomId": roomId, "playerId": playerId, "updatedValue": amount }
    ).then(res => setRecords({...updateRecords}))
    .catch(rejected => {
      console.log(rejected);
      alert(`failed to update chips amount: ${rejected}`);
    })
  }

  const inputChips = (roomId: number, playerId: number) => {
    console.log(`room: ${roomId}, player: ${playerId} - input chips`);
    setDialogPlayerId(playerId);
    setInputDialogOpen(true);
  }

  const handleCloseInputChipsDialog = (newValue: number) => {
    setInputDialogOpen(false);
    console.log(`new value: ${newValue}, player id: ${dialogPlayerId}`);
    updateChipsAmount(parseInt(roomId!), dialogPlayerId, newValue);
    setInputDialogOpen(false);
  }

  React.useEffect(() => {
    axios('/backend/players').then(res => {
      const result1 = res.data.reduce((acc: { [key: number]: string }, cur: Player) => { return Object.assign(acc, { [cur.id]: cur.name }) }, {}) 
      axios(`/backend/records?roomId=${roomId}`).then(res => {
        const result2: PlayerRecordMap = res.data.reduce((acc: { [key: number]: PlayerRecord }, item: Record) => {
          return Object.assign(acc, { [item.player_id]: { "player_id": item.player_id, "player_name": result1[item.player_id], "buy_in": item.buy_in, "cash_out": item.cash_out, "chips_amount": item.chips_amount } })
        }, {})
        setRecords(result2); 
      })
    })
    .catch(rejected => {
      console.log(rejected);
    })
  }, [roomId]);

  return (
    <>
    <List>
      {Object.values(records!).map((item: PlayerRecord) => (
        <React.Fragment key={item.player_id}>
          <ListItem>
            <ListItemText primary={item.player_name} secondary={`buy-in: ${(item.buy_in as number) - (item.cash_out as number)}, Amount of chips: ${item.chips_amount}`} />
            <IconButton aria-label="add" onClick={() => { handleBuyIn(parseInt(roomId!), (item.player_id as number), "buy_in") }}>
              <AddCircleIcon /> 
            </IconButton>
            <IconButton aria-label="add" onClick={() => { handleBuyIn(parseInt(roomId!), (item.player_id as number), "cash_out") }}>
              <RemoveCircleIcon />
            </IconButton>
            <Button variant="contained" onClick={() => { inputChips(parseInt(roomId!), (item.player_id as number)) }}>Input Chips</Button>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
    <ConfirmationDialogRaw id="ringtone-menu" keepMounted open={inputDialogOpen} onClose={handleCloseInputChipsDialog} />
    <Link href={`/result/${roomId}`} underline="none">End</Link>
    </>
  )
}