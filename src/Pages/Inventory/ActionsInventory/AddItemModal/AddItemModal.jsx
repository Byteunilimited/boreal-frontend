import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import "./AddItemModal.css";
import { API_ENDPOINT } from "../../../../util";


export const AddItemModal = ({ show, onClose }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    description: "",
    inventoryTypeId: "", 
  });
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    if (show) {
      fetchInventoryTypes();
    }
  }, [show]);

  const fetchInventoryTypes = async () => {
    try {
      const response = await privateFetch.get("/inventory/type/all");
      setInventoryTypes(response.data.result.items || []);
    } catch (error) {
      console.error("Error fetching inventory types:", error);
      setError("Ocurrió un error al obtener los tipos de inventario.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_ENDPOINT}/inventory/item/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        if (response.status === 422) {
          setError("El código y/o nombre debe tener al menos 6 caracteres.");
        } else if (response.status === 409) {
          setError("El código y/o nombre  ya existe. Por favor, elija otro.");
        } else {
          setError("Ocurrió un error inesperado del servidor.");
        }
        setShowConfirmationModal(true);
        return; 
      }
  
      const data = await response.json();
      setIsSuccessful(true);
      setConfirmationMessage("El elemento fue añadido exitosamente.");
      setShowConfirmationModal(true);
      onSave(data);
  
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Ocurrió un error inesperado. Detalles: " + error.message);
      setShowConfirmationModal(true);
    }
  };
  
  

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  return (
    <div className={`modalOverlay ${show ? "visible" : ""}`}>
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
              value={formData.id}
            />
          </div>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              placeholder="Nombre del item"
              type="text"
              name="description"
              onChange={handleChange}
              required
              value={formData.description}
            />
          </div>
          <div className="formGroup">
            <label>Tipo de Inventario:</label>
            <select
              name="inventoryTypeId"
              onChange={handleChange}
              required
              value={formData.inventoryTypeId}
              className="selects"
            >
              <option value="">Seleccionar tipo de inventario</option>
              {inventoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.description}
                </option>
              ))}
            </select>
          </div>

          <div className="formActions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>

        {showConfirmationModal && (
          <Modal
            title={isSuccessful ? "Éxito" : "Error"}
            text={isSuccessful ? confirmationMessage : error}
            onClose={closeModal}
            modalIcon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
            showCloseButton
          />
        )}
      </div>
    </div>
  );
};
