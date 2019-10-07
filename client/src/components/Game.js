import React, { Component } from "react";
import QRCodes from "./QRCodes";
import QRReader from "./QRReader";

export class Game extends Component {
  render() {
    return (
      <React.Fragment>
        <QRCodes />
        <QRReader />
      </React.Fragment>
    );
  }
}

export default Game;
