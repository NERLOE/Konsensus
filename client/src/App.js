import React from "react";
import QRCode from "qrcode.react";

function App() {
  return (
    <React.Fragment>
      <h1>Konsensus</h1>
      <QRCode value="https://www.minetech.dk"></QRCode>
    </React.Fragment>
  );
}

export default App;
