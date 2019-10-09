import React from "react";
import { BrowserRouter, Route /*, Redirect*/ } from "react-router-dom";
import { Game } from "./components/Game";
import { Home } from "./components/Home";
import { Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className="container">
            <h1 className="title">Konsensus</h1>
            <Route path="/game/:gameID" component={Game} />
            <Route path="/lobby/:gameID" component={Lobby} />
            <Route exact path="/" component={Home} />
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
