import React, { Component } from "react";
import HomeScreen from "./HomeScreen";

export class Home extends Component {
	render() {
		return (
			<React.Fragment>
				<h1 style={{ textAlign: "center" }}>
					Indtast koden til dit spil, eller opret dit eget.
				</h1>
				<HomeScreen />
			</React.Fragment>
		);
	}
}

export default Home;
