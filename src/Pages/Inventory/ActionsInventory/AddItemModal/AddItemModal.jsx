import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import "./AddItemModal.css";
import axios from "axios";
import FormData from "form-data";

export const AddItemModal = ({ show, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isStockEditable, setIsStockEditable] = useState(true);
  const [showStockInput, setShowStockInput] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (show) {
      fetchFilters();
    }
  }, [show]);

  const fetchFilters = async () => {
    try {
      const [typeRes, conditionRes, stateRes, statusRes, storeRes, ownerRes] = await Promise.all([
        privateFetch.get("/inventory/type/all"),
        privateFetch.get("/lifecycle/condition/all"),
        privateFetch.get("/lifecycle/state/all"),
        privateFetch.get("/lifecycle/status/all"),
        privateFetch.get("/location/store/item/all"),
        privateFetch.get("/location/owner/all")
      ]);

      setInventoryTypes(typeRes.data.result.item || []);
      setConditions(conditionRes.data.result.entity || []);
      setStates(stateRes.data.result.entity || []);
      setStatuses(statusRes.data.result.entity || []);
      setStores(storeRes.data.result.store || []);
      setOwners(ownerRes.data.result.zone || []);
    } catch (error) {
      console.error("Error fetching filter data:", error);
      setError("Ocurrió un error al obtener los datos de los filtros.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inventoryTypeId") {
      if (value === "2") {
        setFormData((prev) => ({ ...prev, stock: 0 }));
        setIsStockEditable(false);
        setShowStockInput(false);
      } else {
        setIsStockEditable(true);
        setShowStockInput(true);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
  };
  const handleSubmit = async () => {
    try {
      // Crear una nueva instancia de FormData
      const formDataToSend = new FormData();
  
      // Datos quemados para 'inventory'
      const inventoryData = {
        id: "5559565", // ID quemado
        description: "Manigueta 15 pulgadas", // Descripción quemada
        inventoryTypeId: 1, // ID de tipo de inventario quemado
      };
  
      // Datos quemados para 'options'
      const optionsData = {
        itemConditionId: 1, 
        stateId: 2, 
        statusId: 1, 
        storeId: 2, 
        ownerId: 1,
        quantity: 66,
      };
  

      formDataToSend.append('inventory', JSON.stringify(inventoryData));
      formDataToSend.append('options', JSON.stringify(optionsData));


      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  

      const response = await fetch("https://boreal-api-j8oy.onrender.com/boreal/inventory/item/create", {
        method: 'POST',
        body: formDataToSend, 

      });
  
      // Procesar la respuesta
      const data = await response.json();
  
      if (response.ok) {
        console.log("Success:", data);
      } else {
        console.error("Error en la respuesta:", data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
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
              value={formData.id || ""}
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
              value={formData.description || ""}
            />
          </div>
          <div className="formGroup">
            <label>Tipo de Inventario:</label>
            <select name="inventoryTypeId" onChange={handleChange} required className="selects" value={formData.inventoryTypeId || ""}>  // Valor añadido
              <option value="">Seleccionar tipo</option>
              {inventoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.description}
                </option>
              ))}
            </select>
          </div>
          {showStockInput && (
            <div className="formGroup">
              <label>Cantidad:</label>
              <input
                type="number"
                name="quantity"
                onChange={handleChange}
                required
                value={formData.quantity || ""}
                readOnly={!isStockEditable}
              />
            </div>
          )}
          <div className="formGroup">
            <label>Condición:</label>
            <select name="itemConditionId" onChange={handleChange} required className="selects" value={formData.itemConditionId || ""}>  // Valor añadido
              <option value="">Seleccionar condición</option>
              {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Estado:</label>
            <select name="stateId" onChange={handleChange} required className="selects" value={formData.stateId || ""}>  // Valor añadido
              <option value="">Seleccionar estado</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Calidad:</label>
            <select name="statusId" onChange={handleChange} required className="selects" value={formData.statusId || ""}>  // Valor añadido
              <option value="">Seleccionar estatus</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Bodega:</label>
            <select name="storeId" onChange={handleChange} required className="selects" value={formData.storeId || ""}>  // Valor añadido
              <option value="">Seleccionar bodega</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Propietario:</label>
            <select name="ownerId" onChange={handleChange} required className="selects" value={formData.ownerId || ""}>  // Valor añadido
              <option value="">Seleccionar propietario</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.businessName}
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
