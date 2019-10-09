import React, { Component } from "react";
import QRCodes from "../QRCodes";
import QRReader from "../QRReader";
import axios from "axios";

export class Game extends Component {
	constructor() {
		super();

		this.state = {
			game: null,
			player: null
		};

		this.getPlayerInfo();
	}

	async getPlayerInfo() {
		var res = await axios.get(
			"/api/game/getPlayer/" + this.state.game.id + "/" + localStorage.playerID
		);

		if (res.data.error) {
			return null;
		}

		this.setState({ player: res.data });

		return res.data;
	}

	async check() {
		console.log(this.props);
		console.log(this.props.match.params);
		var res = await axios.get(
			"/api/game/get/" + this.props.match.params.gameID
		);

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
		console.log(this.state);
		if (this.state.player == null) return null;

		return (
			<React.Fragment>
				<h1>Hej {this.state.player.name}</h1>
			</React.Fragment>
		);
	}
}

export default Game;
