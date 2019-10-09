import React, { Component } from "react";
import QRModal from "../QRModal";
import axios from "axios";

export class Game extends Component {
	constructor() {
		super();

		this.state = {
			game: null,
			player: null,
			showQRModal: false,
			continentCode: "",
			error: false
		};
	}

	getDilemma = data => {
		axios
			.get("/api/game/getRandomDilemma/" + this.state.game.id + "/" + data)
			.then(res => {
				if (res.data.error) return;

				console.log(res.data);
			});
	};

	handleScan = data => {
		console.log(data);
		if (data) {
			this.getDilemma(data);
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

	handleKeyPress = e => {
		if (e.charCode == 13) {
			// Trykkede ENTER
			console.log("Enter");
			this.getDilemma(this.state.continentCode);
		}
	};

	handleChange = e => {
		this.setState({ continentCode: e.target.value, error: false });
	};

	render() {
		if (this.state.player == null) return null;

		return (
			<React.Fragment>
				<div className="text-center">
					<h1>Er det din tur?</h1>
					<div className="input-group input-group-lg">
						<input
							type="text"
							className={
								"form-control gameCodeInput" +
								(this.state.error ? " shake animated wrongCode" : "")
							}
							placeholder="Indtast kontinent manuelt"
							onKeyPress={this.handleKeyPress}
							onChange={this.handleChange.bind(this)}
							value={this.state.gameCode}
						/>
					</div>
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
