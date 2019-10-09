import React from "react";
import { BrowserRouter, Route /*, Redirect*/ } from "react-router-dom";
import Game from "./components/Game";
import Home from "./components/Home";
import Lobby from "./components/game/Lobby";
import Join from "./components/game/Join";
//import { Cookies } from "react-cookie";
//import { instanceOf } from "prop-types";

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<div className="container-fluid">
						<div className="topHeader">
							<h1 className="title">Konsensus</h1>
							<h4 className="subTitle">Dilemma spillet som dømmer dig!</h4>
						</div>
						<Route path="/g/:gameID" component={Game} />
						<Route path="/l/:gameID" component={Lobby} />
						<Route path="/j/:gameID" component={Join} />
						<Route exact path="/" component={Home} />
					</div>
				</React.Fragment>
			</BrowserRouter>
		);
	}
}

export default App;
