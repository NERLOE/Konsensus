import React, { Component } from "react";
import QRCode from "qrcode.react";

export class QR extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="col qrGameCodeCol">
					<QRCode
						className="qrCode"
						value={this.props.value}
						size={75}
					></QRCode>
					<h1 className="gameCode">{this.props.value}</h1>
				</div>
			</React.Fragment>
		);
	}
}

export default QR;
