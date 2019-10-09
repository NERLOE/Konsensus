import React, { Component } from "react";
import QRModal from "./QRModal";

export class HomeScreen extends Component {
  constructor() {
    super();

    this.state = {
      gameCode: "",
      error: false,
      popupMessage: null
    };
  }

  handleKeyPress = e => {
    if (e.charCode == 13) {
      // Trykkede ENTER
      console.log("Enter");
      this.joinGame();
    }
  };

  handleChange = e => {
    this.setState({ gameCode: e.target.value, error: false });
  };
  render() {
    return (
      <React.Fragment>
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
        {this.state.popupMessage ? (
          <div className="popupMessage">{this.state.popupMessage}</div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default HomeScreen;
