import React, { Component } from "react";
import QrReader from "react-qr-reader";

export class QRModal extends Component {
	render() {
		console.log(this.props);
		return (
			<React.Fragment>
				<div className="bgModal">
					<div className="modalContent">
						<div className="modalCloseButton" onClick={this.props.toggleMethod}>
							+
						</div>

						<QrReader
							delay={500}
							onError={this.props.handleError}
							onScan={this.props.handleScan}
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
