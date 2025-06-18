import { NavLink } from "react-router-dom";
import Status from "./Status.jsx";
import { useState } from "react";

export default function Nav() {
  const [isLoggedIn, setIsLoggendIn] = useState(false);

  console.log("nav");

  return (
    <div>
      <h1 id="my-title">
        <NavLink to="/">게시판</NavLink>
      </h1>
      <ul>
        <Status isLoggedIn={isLoggedIn} />
      </ul>
    </div>
  );
}
