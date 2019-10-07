import React, { Component } from "react";
import QR from "./QR";

export class QRCodes extends Component {
  render() {
    return (
      <div className="row">
        <QR value="Asien" />
        <QR value="Afrika" />
        <QR value="Europa" />
        <QR value="Amerika" />
      </div>
    );
  }
}

export default QRCodes;
