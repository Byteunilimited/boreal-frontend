import React, { useState } from "react";
import './NavBar.css';
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts";


export const NavBar = ({ userName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, LogOut } = useAuth();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navBarContainer">
      <div className="profileContainer" onClick={toggleMenu}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/6326/6326055.png"
          alt="Bienvenido"
          className="profileImage"
        />
        <span className="userName">                       
        {user?.nombre} <br/>
        {user?.rol?.nombre}</span>
      </div>
      {menuOpen && (
        <div className="dropdownMenu">
          <ul>
            <li><Link to={"/users/edit-user"}>Perfil</Link></li>
            <li>Cerrar sesión</li>
          </ul>
        </div>
      )}
    </div>
  );
};
