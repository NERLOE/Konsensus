import React, { Component } from "react";
import QRModal from "../QRModal";
import axios from "axios";

export class Game extends Component {
	constructor() {
		super();

		this.state = {
			game: null,
			player: null,
			showQRModal: false
		};
	}

	handleScan = data => {
		if (data) {
			axios
				.get("/api/game/getRandomDilemma/" + this.state.game.id + "/" + data)
				.then(res => {
					if (res.data.error) return;

					console.log(res.data);
				});
		}
	};

	handleError = err => {
		console.log(err);
	};

	toggleQRModal = () => {
		this.setState({ showQRModal: !this.state.showQRModal });
	};

	async getPlayerInfo() {
		if (!this.state.game) {
			setTimeout(() => {
				this.getPlayerInfo();
			}, 500);
			return;
		}

		var res = await axios.get(
			"/api/game/getPlayer/" + this.state.game.id + "/" + localStorage.playerID
		);

		if (res.data.error) {
			return null;
		}

		this.setState({ player: res.data });

		setTimeout(() => {
			this.getPlayerInfo();
		}, 1000 * 1);

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
		this.getPlayerInfo();
	}

	render() {
		console.log(this.state);
		if (this.state.player == null) return null;

		return (
			<React.Fragment>
				<div className="text-center">
					<h1>Er det din tur?</h1>
					<button
						onClick={this.toggleQRModal}
						className="btn btn-lg btn-success scanGameBtn"
					>
						Scan kort
					</button>
				</div>
				{this.state.showQRModal ? (
					<QRModal
						handleScan={this.handleScan.bind(this)}
						handleError={this.handleError.bind(this)}
						toggleMethod={this.toggleQRModal.bind(this)}
					/>
				) : null}
				<h2 className="showBottom">{this.state.player.name}</h2>
			</React.Fragment>
		);
	}
}

export default Game;
