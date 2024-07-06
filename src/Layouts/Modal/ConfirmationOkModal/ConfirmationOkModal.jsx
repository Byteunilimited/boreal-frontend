import React from "react";
import PropTypes from "prop-types";
import "./ConfirmationOkModal.css";

export const ConfirmationOkModal = ({ message, onClose }) => {
  return (
    <div className="modalOverlay show">
      <div className="modalContent">
        <h2>Confirmación</h2>
        <p>{message}</p>
        <div className="formActions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationOkModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


