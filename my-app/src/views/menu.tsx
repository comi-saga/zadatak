import React from "react"
import { Stack } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "../index.css";

export const Menu = () =>{
    const location = useLocation();
    const classNameAbout1 = location.pathname === "/about1" ? "list-group-item active" : "list-group-item";
    const classNameAllUsers = location.pathname === "/" ? "list-group-item active" : "list-group-item";
    const classNameAbout2 = location.pathname === "/about2" ? "list-group-item active" : "list-group-item";
    
    const styleForText = {
        color: "black",
        fontWeight: "bold"
    };

    return (
    <Stack className="left-menu">
      <ul className="list-group">
        <li className={classNameAllUsers}>
          <Link to="/"><span style={styleForText}>Svi korisnici</span></Link>
        </li>
        <li  className={classNameAbout1}>
          <Link to="/about1"><span style={styleForText}>About 1</span> </Link>
        </li>
        <li className={classNameAbout2}>
          <Link to="/about2"><span style={styleForText}>About 2</span> </Link>
        </li>
      </ul>
    </Stack>
  );
}