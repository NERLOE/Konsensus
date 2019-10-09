import React, { Component } from "react";
import axios from "axios";
import { QR } from "../QR";
import Players from "./Players";

export class Lobby extends Component {
	constructor() {
		super();

		this.state = {
			game: null
		};
	}

	async updateGame() {
		var res = await axios.get(
			"/api/game/get/" + this.props.match.params.gameID
		);

		if (res.data.error) return;

		this.setState({
			game: res.data
		});

		setTimeout(() => {
			this.updateGame();
		}, 1000);
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
		this.updateGame();
		//this.setupBeforeUnloadListener();
	}

	/* 	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.deleteGame());
	}

	deleteGame = () => {
		axios.put("/api/game/delete/" + this.props.match.params.gameID).then(res => {
			console.log(res);
		});
		console.log("Deleted");
	};

	setupBeforeUnloadListener = () => {
		window.addEventListener("beforeunload", this.deleteGame());
  }; */

	closeHandler = () => {
		this.props.history.push("/");
	};

	render() {
		if (!this.state.game) return null;

		return (
			<React.Fragment>
				<div className="closeSite">
					<a
						onClick={this.closeHandler}
						data-toggle="tooltip"
						data-placement="top"
						title="Luk spil"
					>
						+
					</a>
				</div>
				<div className="codeInfo">
					<QR value={this.state.game.id}></QR>
				</div>
				<div className="gameInfo">
					<div className="playerInfo">
						<Players players={this.state.game.players}></Players>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Lobby;
