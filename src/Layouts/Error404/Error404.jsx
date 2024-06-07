import React from 'react';
import './Error404.css'; 

export const Error404 = () => {
  return (
    <div className="error-container">
      <img src="https://www.questionpro.com/blog/wp-content/uploads/2015/09/cara_triste_pegatina_redonda-r861f65fdcb8640dca0261c60f986f8a4_v9waf_8byvr_1200.jpg" alt="Error 404" className="error-image" />
      <h1 className="error-title">404 - Página no encontrada</h1>
      <p className="error-message">Lo sentimos, la página que estás buscando no existe.</p>
    </div>
  );
};

