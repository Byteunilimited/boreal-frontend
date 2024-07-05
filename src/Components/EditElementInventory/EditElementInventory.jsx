import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./EditElementInventory.css";

export const EditElementInventory = ({ show, item, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.Código,
        description: item.Nombre,
        stock: item.Existencias,
        isEnable: item.Estado === "Activo" ? "true" : "false",
        inventoryType: {
          description: item.Tipo,
        },
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleInventoryTypeChange = (e) => {
    setFormData({
      ...formData,
      inventoryType: {
        ...formData.inventoryType,
        description: e.target.value,
      },
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const apiUrl = "https://boreal-api.onrender.com/boreal/inventory/update";
      const response = await axios.put(apiUrl, formData);
      if (response.status === 200) {
        console.log("Éxito");
        onSave(formData);
      } else {
        console.log("Ocurrió un error inesperado.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modalOverlay" >
      <div className="modalContent">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Editar Ítem</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Código:
            <input type="text" name="id" value={formData.id || ""} disabled />
          </label>
          <label>
            Descripción:
            <input
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Existencias:
            <input
              type="number"
              name="stock"
              value={formData.stock || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Tipo de elemento:
            <input
              type="text"
              name="inventoryTypeDescription"
              value={formData.inventoryType?.description || ""}
              onChange={handleInventoryTypeChange}
            />
          </label>
          <label>Estado:</label>
          <select
            name="isEnable"
            value={formData.isEnable}
            onChange={handleChange}
            required
            className="selectState"
          >
            <option value="">Seleccionar estado</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

EditElementInventory.propTypes = {
  show: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
