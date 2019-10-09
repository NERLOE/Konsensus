import React, { Component } from "react";
import QRModal from "./QRModal";

export class HomeScreen extends Component {
  render() {
    return (
      <div className="homeScreen">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className={
              "form-control gameCodeInput" +
              (this.state.error ? " shake animated wrongCode" : "")
            }
            placeholder="Indtast spilkode"
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange.bind(this)}
            value={this.state.gameCode}
          />
        </div>
        <button
          onClick={this.joinGame}
          className="btn btn-lg btn-primary joinGameBtn"
        >
          Tilslut til spil
        </button>
        <QRModal />
        <h1>eller</h1>
        <button
          onClick={this.createGame}
          className="btn btn-lg btn-secondary createGameBtn"
        >
          Opret spil
        </button>
      </div>
    );
  }
}

export default HomeScreen;
