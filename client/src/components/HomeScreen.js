import React, { Component } from "react";
import QRModal from "./QRModal";
import axios from "axios";

export class HomeScreen extends Component {
	constructor() {
		super();

		this.state = {
			gameCode: "",
			error: false,
			popupMessage: null
		};
	}

	joinGame = () => {
		var code = this.state.gameCode.trim();
		if (code == "") {
			this.setState({ error: true });
			return;
		}

		console.log("Trying to join game with code: " + code);

		axios.get("/api/getGame/" + code).then(res => {
			if (res.data.error) {
				// Fejl
				this.setState({ error: true });
				console.log(res.data.error);
			} else {
				// Success
				console.log(res.data);
				var game = res.data;
				this.props.history.push("/game/" + game.id);
			}
		});
	};

	createGame = () => {
		console.log("Trying to create game");

		axios.put("/api/createGame").then(res => {
			if (res.data.error) {
				console.log(res.data.error);
			} else {
				console.log(res.data);
				var game = res.data;
				this.props.history.push("/lobby/" + game.id);
			}
		});
	};

	handleKeyPress = e => {
		if (e.charCode == 13) {
			// Trykkede ENTER
			console.log("Enter");
			this.joinGame();
		}
	};

	handleChange = e => {
		this.setState({ gameCode: e.target.value, error: false });
	};
	render() {
		return (
			<React.Fragment>
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
						Tilslut til spil
					</button>
					{/* <QRModal /> */}
					<h1>eller</h1>
					<button
						onClick={this.createGame}
						className="btn btn-lg btn-secondary createGameBtn"
					>
						Opret spil
					</button>
				</div>
				{this.state.popupMessage ? (
					<div className="popupMessage">{this.state.popupMessage}</div>
				) : null}
			</React.Fragment>
		);
	}
}

export default HomeScreen;
