import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import './App.css';
import Container from '@mui/material/Container'
import { Pages } from './pages/Pages'
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <HashRouter>
          <Pages />
        </HashRouter>
      </Container>
    </React.Fragment>
  );
}

export default App;
