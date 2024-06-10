import React from "react";
import { Link } from "react-router-dom";
import { TextCarousel, ServicesYearlyChart, ValueYearlyChart, Button } from "../../Components";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Dashboard = () => {
  const userDoc = "1562489996";
  const userName = "Admin";
  const userEmail = 'usuariodeprueba@gmail.com';
  const userRole = 'Administrador';

  return (
    <div className="contentMain">
      <div className="container bg-light-gray p-10 my-3 rounded-3">
        <div className="row">
          <div className="col-lg-6 mb-3">
            <div className="welcome-message bg-light-blue rounded-3 shadow-sm p-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6326/6326055.png"
                alt="Bienvenido"
                className="welcome-image"
              />
              <div className="user-info">
                <h3>{userName}</h3>
                <p>{userDoc}</p>
                <p>{userEmail}</p>
                <p>{userRole}</p>
                <Button text="Editar"/>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-3">
            <div className="text-carousel bg-light-blue rounded shadow-sm p-3">
              <TextCarousel />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="chart bg-light-blue rounded shadow-sm p-3">
              <h3>Servicios al Año</h3>
              <ServicesYearlyChart />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="chart bg-light-blue rounded shadow-sm p-3">
              <h3>Valor al Año</h3>
              <ValueYearlyChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
