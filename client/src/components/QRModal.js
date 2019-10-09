import React, { Component } from "react";
import QrReader from "react-qr-reader";
import axios from "axios";

export class QRModal extends Component {
	handleScan = data => {
		if (data) {
			axios.get("/api/game/get/" + data).then(res => {
				if (!res.data.error) {
					// Success
					console.log(res.data);
					var game = res.data;
					this.props.switchURL("/j/" + game.id);
				}
			});
		}
	};

	handleError = err => {
		console.log(err);
	};

	render() {
		return (
			<React.Fragment>
				<div className="bgModal">
					<div className="modalContent">
						<div className="modalCloseButton" onClick={this.props.toggleMethod}>
							+
						</div>

						<QrReader
							delay={500}
							onError={this.handleError}
							onScan={this.handleScan}
							style={{ height: "100%", borderRadius: "25px" }}
							facingMode={"environment"}
							className="qrReader"
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default QRModal;
