import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [data, setData] = React.useState(null)
  React.useEffect(() => {
    fetch("/backend")
      .then(res => res.json())
      .then((data) => setData(data.message))
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{!data ? "loading" : data}</p>
      </header>
    </div>
  );
}

export default App;
