import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import "./AddItemModal.css";
import { API_ENDPOINT } from "../../../../util";
import Select from "react-select";

export const AddItemModal = ({ show, onClose, onSave }) => {
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
  const [data, setData] = useState([]);

  useEffect(() => {
    if (show) {
      fetchInventoryTypes();
    }
  }, [show]);

  const fetchInventoryTypes = async () => {
    try {
      const response = await privateFetch.get("/inventory/type/all?page=0&size=2000");
      const types = response.data.result.items || [];
      const options = types.map((type) => ({
        value: type.id,
        label: type.description
      }));
      setInventoryTypes(options);
    } catch (error) {
      console.error("Error fetching inventory types:", error);
      setError("Ocurrió un error al obtener los tipos de inventario.");
    }
  };


  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, inventoryTypeId: selectedOption ? selectedOption.value : "" }));
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
        body: formData ? JSON.stringify(formData) : null,
      });
  
      const jsonResponse = await response.json(); 
  
      if (response.status === 200) {
        const data = jsonResponse.result.items[0];
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue añadido exitosamente.");
        setShowConfirmationModal(true);
        setData(data);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else if (response.status === 422) {
        setIsSuccessful(false);
        setError("El código y/o nombre debe tener al menos 6 caracteres.");
      } else if (response.status === 409) {
        setIsSuccessful(false);
        setError("El código y/o nombre ya existe. Por favor, elija otro.");
      } else {
        setIsSuccessful(false);
        setError("Ocurrió un error inesperado del servidor.");
      }
  
      setShowConfirmationModal(true);
      return;
  
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Ocurrió un error inesperado. Detalles: " + error.message);
      setShowConfirmationModal(true);
    }
  };
  

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onSave(data);
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
            <Select
              options={inventoryTypes}
              onChange={handleSelectChange}
              placeholder="Seleccionar tipo de inventario"
              value={inventoryTypes.find(option => option.value === formData.inventoryTypeId)}
              isClearable
              className="selects"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "1em",
                  textAlign: "start",
                }),
              }}
            />
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
