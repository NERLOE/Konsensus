import React, { Component } from "react";

export class Join extends Component {
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
          Bekræft
        </button>
      </div>
    );
  }
}

export default Join;
