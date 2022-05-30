import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Container from '@mui/material/Container'
import { Pages } from './pages/Pages'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';



function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx = {{ padding: '0px 0px' }}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
