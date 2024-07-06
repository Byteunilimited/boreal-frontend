import React from 'react';
import "../Buttons/Button.css";

export const Button = ({ loading, text, ...props }) => {
  return (
    <button 
      {...props} 
      className="MainButton" 
      disabled={loading}
    >
      {loading ? 'Cargando...' : text}
    </button>
  );
};
