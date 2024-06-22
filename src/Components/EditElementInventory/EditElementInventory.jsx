import React, { useState } from "react";
import "./EditElementInventory.css"; 

export const EditElementInventory = ({ show, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Editar Ítem</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Código:
            <input type="text" name="id" value={formData.id} disabled />
          </label>
          <label>
            Descripción:
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Existencias:
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
          </label>
          <label>
            Tipo de elemento:
            <input type="text" name="inventoryType" value={formData.inventoryType.description} onChange={(e) => setFormData({ ...formData, inventoryType: { ...formData.inventoryType, description: e.target.value } })} />
          </label>
          <label>
            Habilitado:
            <input type="checkbox" name="isEnable" checked={formData.isEnable} onChange={handleChange} />
          </label>
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};
