import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddItemModal.css";

export const AddItemModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Código: "",
    Nombre: "",
    Tipo: "",
    Fecha: "",
    Cantidad: 0,
  });

  useEffect(() => {
    if (show) {
      const localDate = new Date();
      const utcOffset = localDate.getTimezoneOffset() * 60000; // En milisegundos
      const adjustedDate = new Date(localDate.getTime() - utcOffset);
      setFormData((prev) => ({
        ...prev,
        Fecha: adjustedDate.toISOString().substr(0, 10),
      }));
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Añadir Nuevo Elemento</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Código:</label>
            <input
              placeholder="Código elemento"
              type="text"
              name="Código"
              value={formData.Código}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              placeholder="Nombre elemento"
              type="text"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Tipo:</label>
            <input
              placeholder="Tipo elemento"
              type="text"
              name="Tipo"
              value={formData.Tipo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Fecha:</label>
            <input
              placeholder="Fecha ingreso"
              type="date"
              name="Fecha"
              value={formData.Fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Cantidad:</label>
            <input
              placeholder="Cantidad existente"
              type="number"
              name="Cantidad"
              value={formData.Cantidad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formActions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddItemModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
