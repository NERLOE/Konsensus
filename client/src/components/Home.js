import React, { Component } from "react";
import axios from "axios";
import HomeScreen from "./HomeScreen";

export class Home extends Component {
  joinGame = () => {
    var code = this.state.gameCode.trim();
    if (code == "") {
      this.setState({ error: true });
      return;
    }

    console.log("Trying to join game with code: " + code);

    axios.get("/api/getGame/" + code).then(res => {
      if (res.data.error) {
        // Fejl
        this.setState({ error: true });
        console.log(res.data.error);
      } else {
        // Success
        console.log(res.data);
        var game = res.data;
        this.props.history.push("/game/" + game.id);
      }
    });
  };

  createGame = () => {
    console.log("Trying to create game");

    axios.put("/api/createGame").then(res => {
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        console.log(res.data);
        var game = res.data;
        this.props.history.push("/lobby/" + game.id);
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: "center" }}>
          Indtast koden til dit spil, eller opret dit eget.
        </h1>
        <HomeScreen />
        {this.state.popupMessage ? (
          <div className="popupMessage">{this.state.popupMessage}</div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Home;
