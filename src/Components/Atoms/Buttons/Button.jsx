import React from 'react';
import "./Button.css";

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
