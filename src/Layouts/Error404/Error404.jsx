import React from 'react';
import './Error404.css'; 
import { robot404 } from '../../assets';


export const Error404 = () => {
  return (
    <div className="errorContainer404">
      <img src={robot404} alt="Error 404" className="errorTmage404" />
      <h1 className="errorTitle404">404 - Página no encontrada</h1>
      <p className="errorMessage404">Lo sentimos, la página que estás buscando no existe.</p>
    </div>
  );
};

