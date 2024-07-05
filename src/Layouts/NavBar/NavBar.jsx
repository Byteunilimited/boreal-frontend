import React, { useState } from "react";
import './NavBar.css';
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts";
import { RiUser3Line } from "react-icons/ri";

export const NavBar = ({ userName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, LogOut } = useAuth();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navBarContainer">
      <div className="profileContainer" onClick={toggleMenu}>
        <RiUser3Line className="profileIcon"/>
        <span className="userName">                       
          {user?.nombre} <br/>
          {user?.rol?.nombre}
        </span>
      </div>
      {menuOpen && (
        <div className="dropdownMenu">
          <ul>
            <li><Link to={"/users/edit-user"}>Perfil</Link></li>
            <li onClick={LogOut}>Cerrar sesión</li>
          </ul>
        </div>
      )}
    </div>
  );
};
