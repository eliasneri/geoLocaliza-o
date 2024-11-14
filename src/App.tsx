import React from 'react';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import Geolocalizacao from "./component/geolocalizador";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Geolocalizador</h2>
            <Geolocalizacao />
      </header>
    </div>
  );
}

export default App;
