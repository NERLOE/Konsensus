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
			error: false,
			dilemma: null,
			answered: null
		};
	}

	getDilemma = data => {
		axios
			.get("/api/game/getRandomDilemma/" + this.state.game.id + "/" + data)
			.then(res => {
				if (res.data.error) return;

				this.setState({ dilemma: res.data });
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

	handleAnswerOne = () => {
		var dilemma = this.state.dilemma;

		this.state.answered = dilemma.answerOne;
		axios
			.get(
				"/api/game/addPoints/" +
					this.state.game.id +
					"/" +
					this.state.player.id +
					"/" +
					dilemma.answerOne.points
			)
			.then(res => {
				console.log(res);
			});

		this.state.dilemma = null;
		setTimeout(() => {
			this.state.answered = null;
		}, 1000 * 2);

		console.log("(1) Du valgte: " + dilemma.answerOne.text);
		console.log("Konsekvens: " + dilemma.answerOne.resultText);
		console.log("Total points: " + dilemma.answerOne.points);
	};

	handleAnswerTwo = () => {
		var dilemma = this.state.dilemma;

		this.state.answered = dilemma.answerTwo;
		axios
			.get(
				"/api/game/addPoints/" +
					this.state.game.id +
					"/" +
					this.state.player.id +
					"/" +
					dilemma.answerTwo.points
			)
			.then(res => {
				console.log(res);
			});

		this.state.dilemma = null;
		setTimeout(() => {
			this.state.answered = null;
		}, 1000 * 5);
		console.log("(2) Du valgte: " + dilemma.answerTwo.text);
		console.log("Konsekvens: " + dilemma.answerTwo.resultText);
		console.log("Total points: " + dilemma.answerTwo.points);
	};

	render() {
		if (this.state.player == null) return null;

		if (this.state.answered) {
			return (
				<React.Fragment>
					<div className="text-center">
						<h1>Du modtog {this.state.answered.points}!</h1>
						<p>{this.state.answered.resultText}</p>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<div className="text-center">
						{!this.state.dilemma ? (
							<React.Fragment>
								<h1>Er det din tur?</h1>
								<div className="input-group input-group-lg">
									<input
										type="text"
										className={
											"form-control manualCategoryInput" +
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
							</React.Fragment>
						) : (
							<React.Fragment>
								<h4>{this.state.dilemma.question}</h4>
								<button
									className="btn btn-warning"
									onClick={this.handleAnswerOne}
								>
									{this.state.dilemma.answerOne.text}
								</button>
								<button
									className="btn btn-success"
									onClick={this.handleAnswerTwo}
								>
									{this.state.dilemma.answerTwo.text}
								</button>
							</React.Fragment>
						)}
					</div>
					{this.state.showQRModal ? (
						<QRModal
							handleScan={this.handleScan.bind(this)}
							handleError={this.handleError.bind(this)}
							toggleMethod={this.toggleQRModal.bind(this)}
						/>
					) : null}
					<h2 className="showBottomLeft">{this.state.player.name}</h2>
					<h2 className="showBottomRight">
						Point: {this.state.player.stats.points}
					</h2>
				</React.Fragment>
			);
		}
	}
}

export default Game;
