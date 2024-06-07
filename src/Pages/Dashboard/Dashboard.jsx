import React from 'react'
import { Link } from "react-router-dom";
import { UserImg } from '../../assets';
import {TextCarousel, ServicesYearlyChart, ValueYearlyChart} from "../../Components";
import "./Dashboard.css";

export const Dashboard= () => {
  const userName = "Nombre del Usuario"; 

  return (
    <div className="panel-container">
    
      <div className="user-profile">
      <img src={UserImg} alt="User" />
        <div className="user-info">
          <h2>{userName}</h2>
          <Link to="/boreal/editar-perfil">Editar Perfil</Link>
        </div>
      </div>
      <div className="welcome-message">
        <h3>Bienvenido, {userName}</h3>
      </div>
      <div className="text-carousel">
        <TextCarousel />
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

