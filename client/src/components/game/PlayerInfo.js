import React, { Component } from "react";

export class PlayerInfo extends Component {
	render() {
		var { player } = this.props;
		return (
			<React.Fragment>
				<h1>
					<b>{player.name}</b>
				</h1>
				<h2>
					<i>{player.stats.points}</i>
				</h2>
			</React.Fragment>
		);
	}
}

export default PlayerInfo;
