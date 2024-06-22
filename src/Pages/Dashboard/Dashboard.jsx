import React from "react";
import {
  TextCarousel,
  ServicesYearlyChart,
  ValueYearlyChart,
  Button,
} from "../../Components";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Dashboard = () => {
  const userName = "Admin";
  const userEmail = "usuariodeprueba@gmail.com";

  return (
    <div className="contentMain">
      <div className="container bg-light-gray p-10 my-3 rounded-3">
        <div className="row charts">
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
