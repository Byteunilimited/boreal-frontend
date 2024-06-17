import React from 'react';
import './Error404.css'; 

export const Error404 = () => {
  return (
    <div className="errorContainer">
      <img src="https://www.questionpro.com/blog/wp-content/uploads/2015/09/cara_triste_pegatina_redonda-r861f65fdcb8640dca0261c60f986f8a4_v9waf_8byvr_1200.jpg" alt="Error 404" className="errorTmage" />
      <h1 className="errorTitle">404 - Página no encontrada</h1>
      <p className="errorMessage">Lo sentimos, la página que estás buscando no existe.</p>
    </div>
  );
};

