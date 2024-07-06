import React from 'react';
import './ConfirmationModal.css';

  export const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) {
      return null;
    }
  
    return (
      <div className="confirmationModalOverlay">
        <div className="confirmationModal">
          <h4>{message || '¿Estás seguro de realizar esta acción?'}</h4>
          <div className="confirmationModalButtons">
            <button className="confirmButton" onClick={onConfirm}>Confirmar</button>
            <button className="cancelButton" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };