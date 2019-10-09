import React, { Component } from "react";
import QrReader from "react-qr-reader";

export class QRReader extends Component {
  constructor() {
    super();

    this.state = {
      result: "Intet resultat"
    };
  }

  handleScan = data => {
    if (data) {
      this.setState({ result: data });
      alert(data);
    }
  };

  handleError = err => {
    console.log(err);
  };

  render() {
    return (
      <div>
        <QrReader
          delay={0}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "50%" }}
          facingMode={"environment"}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default QRReader;
