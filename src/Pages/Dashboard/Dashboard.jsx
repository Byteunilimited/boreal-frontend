import React from "react";
import {
  TextCarousel,
  ServicesYearlyChart,
  ValueYearlyChart,
  Button,
} from "../../Components";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Alert, Col, Container, Row, FormSelect, Spinner } from 'react-bootstrap';
import { useAuth } from "../../Contexts";

export const Dashboard = () => {
  const { user } = useAuth();
  useEffect(() => {
    document.title = "Panel";
}, []);

  return (
    <div className="contentMain">
    <Row className='my-3'>
        <Col sm>
          <Alert>
            Hola <strong>{user?.nombre}</strong> ,bienvenido de nuevo a Boreal
          </Alert>
        </Col>
      </Row>
        <div className="row charts">
          <div className="col-md-6 mb-3">
            <div className="chart">
              <h4>Servicios al Año</h4>
              <ServicesYearlyChart />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="chart ">
              <h4>Valor al Año</h4>
              <ValueYearlyChart />
            </div>
          </div>
        </div>
    </div>
  );
};
