import React, { Component } from "react";
import QRCodes from "./QRCodes";
import QRReader from "./QRReader";
import axios from "axios";

export class Game extends Component {
  constructor() {
    super();

    this.state = {
      game: null
    };

    this.check();
  }

  async check() {
    console.log(this.props);
    console.log(this.props.match.params);
    var res = await axios.get("/api/getGame/" + this.props.match.params.gameID);

    if (res.data.error) {
      this.props.history.push("/");
      return;
    }

    var g = res.data;
    this.setState({ game: g });
  }

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
