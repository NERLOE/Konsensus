import React, { Component } from "react";
import QRCodes from "./QRCodes";
import QRReader from "./QRReader";
import axios from "axios";

export class Game extends Component {
  async constructor() {
    super();

    var res = await axios.get("/api/getGame/" + code);

    if (res.data.error) {
      this.props.history.push("/");
      return;
    }

    var g = res.data;
    this.state = {
      game: g
    };
  }

  componentWillMount() {}

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
