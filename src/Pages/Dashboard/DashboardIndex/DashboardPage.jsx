import React from "react";
import {
  TextCarousel,
  ServicesYearlyChart,
  Button,
} from "../../../Components";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Alert, Col, Container, Row, FormSelect, Spinner } from 'react-bootstrap';
import { useAuth } from "../../../Contexts";

export const Dashboard = () => {
  const { user } = useAuth();
  useEffect(() => {
    document.title = "Panel";
  }, []);

  return (
    <div className="contentMain">
      <div className="welcomeBanner">
        <div className="welcomeText">
          <h2>Bienvenido de nuevo a tu</h2>
          <h1>Administrador de tareas diarias</h1>
        </div> 
      </div>
      {/*<ServicesYearlyChart /> */}

    </div>
  );
};
