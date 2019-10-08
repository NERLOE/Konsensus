import React, { Component } from "react";
import axios from "axios";

export class Home extends Component {
	constructor() {
		super();

		this.state = {
			gameCode: "",
			error: false
		};
	}

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
			}
		});
	};

	render() {
		return (
			<div>
				<h1 style={{ textAlign: "center" }}>
					Indtast koden til dit spil, eller opret dit eget.
				</h1>
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
					<h1>eller</h1>
					<button
						onClick={this.createGame}
						className="btn btn-lg btn-secondary createGameBtn"
					>
						Opret spil
					</button>
				</div>
			</div>
		);
	}
}

export default Home;
