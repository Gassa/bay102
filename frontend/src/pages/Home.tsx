import React from "react";
import axios from "axios";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


export default function Home() {
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    axios('/backend/rooms?page=1&limit=300').then(res => {
      setRooms(res.data);
    })
    .catch(rejected => {
      console.log(rejected);
    })
  }, [])
  
  return (
    <List>
      {rooms.map((room) => (
        <React.Fragment key={room["id"]}>
          <ListItemButton component="a" href={`/room/${room['id']}`}>
            <ListItemText primary={room["name"]} secondary={room["created_at"]}/>
          </ListItemButton>
        </React.Fragment>
      ))}
    </List>
  );
}