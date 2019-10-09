import React, { Component } from "react";
import axios from "axios";

export class Join extends Component {
	constructor() {
		super();

		this.state = {
			playerName: "",
			error: false,
			popupMessage: null,
			showQRModal: false,
			game: null
		};
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

	joinGame() {
		var name = this.state.playerName.trim().toUpperCase();
		var game = this.state.game;
		if (name == "") {
			this.setState({ error: true });
			return;
		}

		console.log("Trying to join game with name: " + name);

		axios.get("/api/game/getPlayer/" + game.id + "/" + name).then(res => {
			if (!res.error) {
				this.setState({ error: true });
				return;
			}

			axios.put("/api/game/addPlayer/" + game.id + "/" + name).then(res => {
				if (res.data.error) {
					// Fejl
					this.setState({ error: true });
					console.log(res.data.error);
				} else {
					// Success
					var player = res.data;
					console.log(player);
				}
			});

			axios.get("/api/game/get/" + game.id).then(res => {
				if (res.data.error) {
					// Fejl
					this.setState({ error: true });
					console.log(res.data.error);
				} else {
					// Success
					console.log(res.data);
					var game = res.data;
					this.props.history.push("/g/" + game.id);
				}
			});
		});
	}

	handleKeyPress = e => {
		if (e.charCode == 13) {
			// Trykkede ENTER
			console.log("Enter");
			this.joinGame();
		}
	};

	handleChange = e => {
		this.setState({ playerName: e.target.value, error: false });
	};

	render() {
		return (
			<React.Fragment>
				<div className="homeScreen">
					<h4 style={{ textAlign: "center" }}>
						Indtast et valgfrit navn, og bekræft.
					</h4>
					<div className="input-group input-group-lg">
						<input
							type="text"
							className={
								"form-control playerNameInput" +
								(this.state.error ? " shake animated wrongCode" : "")
							}
							placeholder="Indtast valgfrit navn"
							onKeyPress={this.handleKeyPress}
							onChange={this.handleChange.bind(this)}
							value={this.state.playerName}
						/>
					</div>
					<button
						onClick={this.joinGame}
						className="btn btn-lg btn-primary joinGameBtn"
					>
						Bekræft
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default Join;
