import React, { Component } from "react";
import PlayerInfo from "./PlayerInfo";

export class Players extends Component {
	render() {
		console.log(this.props);
		return (
			<React.Fragment>
				<div className="row">
					{this.props.players.forEach(p => {
						return (
							<div className="col-6">
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
