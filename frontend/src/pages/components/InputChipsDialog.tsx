import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const chips = [ '1', '5', '25', '100', '500' ];
const initMap = { '1': 0, '5': 0, '25': 0, '100': 0, '500': 0 }

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value: number) => void;
}

export function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open, ...other } = props;
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [equation, setEquation] = React.useState('');
  const [chipsMap, setChipsMap] = React.useState(initMap);

  const handleCancel = () => {
    onClose(0);
  };

  const handleOk = () => {
    onClose(totalAmount);
  };

  const composeEquation = () => Object.entries(chipsMap)
    .map((item) => { return `${item[0]} x ${item[1]}`})
    .join(" + ")
  

  const compuateTotalAmount = () => Object.entries(chipsMap)
    .reduce((acc, item) => { return acc + parseInt(item[0]) * item[1]}, 0)

  const handleEntering = () => {
    setChipsMap(initMap);
    setTotalAmount(0);
    setEquation("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, chip: string) => {
    const newValue = parseInt((event.target as HTMLInputElement).value)
    const newChipsMap = Object.assign(chipsMap, { [chip]: newValue });
    const newEquation = composeEquation(); 
    const newTotalAmount = compuateTotalAmount(); 
    setChipsMap({ ...newChipsMap })
    setTotalAmount(newTotalAmount);
    setEquation(newEquation);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Input Chips</DialogTitle>
      <DialogContent dividers>
      {
        chips.map(chip => {
          return (
            <Box key={`chip_${chip}`} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Avatar sx={{ color: 'action.active', mr: 1, my: 0.5 }}>{chip}</Avatar>
              <TextField id={`chip_${chip}`} label="the number of chips" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, chip)} />
            </Box>
          )
        })
      }
      <Divider variant="middle" />
      <Typography color="text.primary" variant="body1">
          total: {equation} = {totalAmount}
      </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}