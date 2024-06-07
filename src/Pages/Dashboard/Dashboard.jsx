import React from "react";
import { Link } from "react-router-dom";
import { UserImg } from "../../assets";
import {
  TextCarousel,
  ServicesYearlyChart,
  ValueYearlyChart,
} from "../../Components";
import "./Dashboard.css";

export const Dashboard = () => {
  const userDoc="1562489996"
  const userName = "Admin";
  const userEmail='usuariodeprueba@gmail.com';
  const userRole='Administrador';

  return (
    <div className="panel-container">
      <h3>¡Bienvenido, {userName}!</h3>
<div className="section1">
      <div className="welcome-message">
        <img
          src="https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg"
          alt="Bienvenido"
          className="welcome-image"
        />
        <div className="user-info">

          <h3>{userName}</h3>
          <p>{userDoc}</p>
          <p>{userEmail}</p>
          <p>{userRole}</p>
        </div>
        <Link to="/boreal/editar-perfil">Editar Perfil</Link>
      </div>

      <div className="text-carousel">
        <TextCarousel />
      </div>
      </div>
      <div className="charts">
        <div className="chart">
          <h3>Servicios al Año</h3>
          <ServicesYearlyChart />
        </div>
        <div className="chart">
          <h3>Valor al Año</h3>
          <ValueYearlyChart />
        </div>
      </div>
    </div>
  );
};
