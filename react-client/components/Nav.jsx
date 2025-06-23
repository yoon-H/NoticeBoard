import { NavLink } from "react-router-dom";
import Status from "./Status.jsx";
import { useState } from "react";

import "../css/nav.css";

export default function Nav({isLoggedIn}) {
  

  return (
    <div>
      <h1 className="my-title">
        <NavLink to="/">게시판</NavLink>
      </h1>
      <ul>
        <Status isLoggedIn={isLoggedIn} />
      </ul>
    </div>
  );
}
