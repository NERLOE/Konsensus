import React, { Component } from "react";
import axios from "axios";
import { QR } from "./QR";

export class Lobby extends Component {
  constructor() {
    super();

    this.state = {
      game: null
    };
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

  componentDidMount() {
    this.check();
  }

  render() {
    if (this.state.game) {
      return (
        <React.Fragment>
          <h1>Kode:</h1>
          <QR value={this.state.game.id}></QR>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h1>Loader...</h1>
        </React.Fragment>
      );
    }
  }
}

export default Lobby;
