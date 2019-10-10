import React, { Component } from "react";
import axios from "axios";
import QRModal from "./QRModal";
import { QR } from "./QR";

export class Home extends Component {
  constructor() {
    super();

    this.state = {
      gameCode: "",
      error: false,
      popupMessage: null,
      showQRModal: false
    };
  }

  handleScan = data => {
    if (data) {
      axios.get("/api/game/get/" + data).then(res => {
        if (!res.data.error) {
          // Success
          console.log(res.data);
          var game = res.data;
          this.switchPage("/j/" + game.id);
        }
      });
    }
  };

  handleError = err => {
    console.log(err);
  };

  toggleQRModal = () => {
    this.setState({ showQRModal: !this.state.showQRModal });
  };

  switchPage = url => {
    this.props.history.push(url);
  };

  joinGame = () => {
    var code = this.state.gameCode.trim().toUpperCase();
    if (code == "") {
      this.setState({ error: true });
      return;
    }

    console.log("Trying to join game with code: " + code);

    axios.get("/api/game/get/" + code).then(res => {
      if (res.data.error) {
        // Fejl
        this.setState({ error: true });
        console.log(res.data.error);
      } else {
        // Success
        console.log(res.data);
        var game = res.data;
        this.props.history.push("/j/" + game.id);
      }
    });
  };

  createGame = () => {
    console.log("Trying to create game");

    axios.put("/api/game/create").then(res => {
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        console.log(res.data);
        var game = res.data;
        this.props.history.push("/l/" + game.id);
      }
    });
  };

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
          <QRCode
            className="qrCode"
            value="https://nnystudents.dk"
            size={75}
          ></QRCode>
          <h4 style={{ textAlign: "center" }}>
            Indtast koden til dit spil, eller opret dit eget.
          </h4>
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
          <button
            onClick={this.toggleQRModal}
            className="btn btn-lg btn-success scanGameBtn"
          >
            Scan spil
          </button>
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
        {this.state.showQRModal ? (
          <QRModal
            handleScan={this.handleScan.bind(this)}
            handleError={this.handleError.bind(this)}
            toggleMethod={this.toggleQRModal.bind(this)}
            switchURL={this.switchPage.bind(this)}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Home;
