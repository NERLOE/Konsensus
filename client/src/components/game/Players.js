import React, { Component } from "react";
import PlayerInfo from "./PlayerInfo";

export class Players extends Component {
  render() {
    var { players } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          {players.map(p => {
            return (
              <div className="col-6" style={{ textAlign: "center" }}>
                <PlayerInfo player={p} />
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Players;
