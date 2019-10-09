import React, { Component } from "react";
import axios from "axios";
import { QR } from "./QR";

export class Lobby extends Component {
	constructor() {
		super();

		this.state = {
			game: null
		};
	}

	async check() {
		console.log(this.props);
		console.log(this.props.match.params);
		var res = await axios.get("/api/getGame/" + this.props.match.params.gameID);

		if (res.data.error) {
			this.props.history.push("/");
			return;
		}

		var g = res.data;
		this.setState({ game: g });
	}

	componentDidMount() {
		this.check();
		this.setupBeforeUnloadListener();
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.deleteGame());
	}

	deleteGame = () => {
		axios.put("/api/deleteGame/" + this.props.match.params.gameID).then(res => {
			console.log(res);
		});
		console.log("Deleted");
	};

	setupBeforeUnloadListener = () => {
		window.addEventListener("beforeunload", this.deleteGame());
	};

	render() {
		if (this.state.game) {
			return (
				<React.Fragment>
					<div className="codeInfo">
						<QR value={this.state.game.id}></QR>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<h1>Loader...</h1>
				</React.Fragment>
			);
		}
	}
}

export default Lobby;
