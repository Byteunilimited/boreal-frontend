import React from 'react';
import './ConfirmationModal.css';

export const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirmationModalOverlay">
      <div className="confirmationModal">
        <h2>¿Estás seguro de realizar esta acción?</h2>
        <div className="confirmationModalButtons">
          <button className="confirmButton" onClick={onConfirm}>Confirmar</button>
          <button className="cancelButton" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

