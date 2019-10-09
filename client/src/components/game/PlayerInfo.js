import React, { Component } from "react";

export class PlayerInfo extends Component {
	render() {
		var { player } = this.props;
		return (
			<React.Fragment>
				<h1>
					{player.name} - ID: {player.id}
				</h1>
			</React.Fragment>
		);
	}
}

export default PlayerInfo;
