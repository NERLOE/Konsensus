import React, { Component } from "react";
import QRCode from "qrcode.react";

export class QR extends Component {
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <div className="col">
          <h1>{this.props.value}</h1>
          <QRCode value={this.props.value}></QRCode>
        </div>
      </React.Fragment>
    );
  }
}

export default QR;
