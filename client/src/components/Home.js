import React, { Component } from "react";
import axios from "axios";

export class Home extends Component {
  handleKeyPress = e => {
    console.log(e);
    console.log(e.charCode);
    if (e.charCode == 13) {
      // Trykkede ENTER
      console.log("Enter");
      this.joinGame(e.target.value);
    }
  };

  joinGame = code => {
    console.log("Trying to join game with code: " + code);

    axios.get("/api/getGame/" + code).then(res => {
      if (res.error) {
        console.log(res.error);
      } else {
        console.log(res);
      }
    });
  };

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>
          Indtast koden til dit spil, eller opret dit eget.
        </h1>
        <div className="homeScreen">
          <div className="input-group input-group-lg">
            <input
              type="text"
              className="form-control gameCodeInput"
              placeholder="Indtast spilkode"
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <button className="btn btn-lg btn-primary joinGameBtn">
            Tilslut til spil
          </button>
          <h1>eller</h1>
          <button className="btn btn-lg btn-secondary createGameBtn">
            Opret spil
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
