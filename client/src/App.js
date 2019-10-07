import React from "react";
import { BrowserRouter, Route /*, Redirect*/ } from "react-router-dom";
import { Game } from "./components/Game";
import { Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className="container">
            <h1 className="title">Konsensus</h1>
            <Route exact path="/" component={Game} />
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
