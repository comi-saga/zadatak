import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "./index.css";

export const Menu = () =>{
    const location = useLocation();
    console.log(location.pathname);

    const classNameAddUser = location.pathname == "/addUser" ? "list-group-item active" : "list-group-item";
    const classNameAllUsers = location.pathname == "/" ? "list-group-item active" : "list-group-item";
    const classNameUpdateUser = location.pathname.includes("/updateUser") ? "list-group-item active" : "list-group-item";
    
    const styleForText = {
        color: "black",
        fontWeight: "bold"
    };

    return (
    <div className="left-menu">
      <ul className="list-group">
        <li className={classNameAllUsers}>
          <Link to="/"><span style={styleForText}>Svi korisnici</span></Link>
        </li>
        <li  className={classNameAddUser}>
          <Link to="/addUser"><span style={styleForText}>Dodaj korisnika</span> </Link>
        </li>
        <li className={classNameUpdateUser}>
          <Link to="/updateUser/1"><span style={styleForText}>Azuriraj korisnika</span> </Link>
        </li>
      </ul>
    </div>
  );
}