import React from "react";
import logo from "../shared/images/logoPOWER.png";

function HeaderImageTitle() {
  return (
    <div className="header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1> POEHR</h1>
    </div>
  );
}

export default HeaderImageTitle;
