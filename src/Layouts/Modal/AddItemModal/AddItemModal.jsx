import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddItemModal.css";
import axios from "axios";
import { useForm } from "../../../hooks";


export const AddItemModal = ({ show, onClose, onSave }) => {
  const [error, setError] = useState(null);
  const { serialize } = useForm();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (show) {
      const localDate = new Date();
      const utcOffset = localDate.getTimezoneOffset() * 60000; 
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

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const formData = serialize(ev.target);
    try {
      const apiUrl = `http://192.168.101.15:8080/boreal/inventory/create`;
      const data = await axios.post(apiUrl, formData);
      if (data.status === 200){
        console.log("exito");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };


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
              name="id"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              placeholder="Nombre elemento"
              type="text"
              name="description"
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Cantidad:</label>
            <input
              placeholder="Cantidad existente"
              type="number"
              name="stock"
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
  //onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
