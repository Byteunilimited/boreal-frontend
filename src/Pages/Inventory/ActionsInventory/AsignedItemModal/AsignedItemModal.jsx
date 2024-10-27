import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { API_ENDPOINT } from "../../../../util";

export const AsignedItemModal = ({ show, onClose }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    inventoryId: "",
    conditionId: "",
    stateId: "",
    storeId: "",
    ownerId: "",
    healthId: "",
    quantity: "",
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    if (show) {
      fetchFilters();
    }
  }, [show]);

  const fetchFilters = async () => {
    try {
      const [inventoryRes, conditionRes, stateRes, storeRes, ownerRes, healthRes] = await Promise.all([
        privateFetch.get("/inventory/item/all"),
        privateFetch.get("/lifecycle/condition/all"),
        privateFetch.get("/lifecycle/state/all"),
        privateFetch.get("/location/store/item/all"),
        privateFetch.get("/location/owner/all"),
        privateFetch.get("/lifecycle/health/all"),
      ]);
      setInventoryItems(inventoryRes.data.result.items || []);
      setConditions(conditionRes.data.result.items || []);
      setStates(stateRes.data.result.items || []);
      setStores(storeRes.data.result.items || []);
      setOwners(ownerRes.data.result.items || []);
      setHealthStatuses(healthRes.data.result.items || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
      setError("Ocurrió un error al obtener los filtros.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await privateFetch.post("/inventory/item/stock/assign", formData);
      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El stock fue asignado exitosamente.");
      } else {
        setError(`Hubo un problema. Código de respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Ocurrió un error inesperado. Detalles: " + error.message);
    }
    setShowConfirmationModal(true);
  };
    const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  return (
    <div className={`modalOverlay ${show ? "visible" : ""}`}>
      <div className="modalContent">
        <h2>Asignar Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Inventario:</label>
            <select name="inventoryId" onChange={handleChange} required value={formData.inventoryId} className="selects">
              <option value="">Seleccionar inventario</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}-{item.description} 
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Condición:</label>
            <select name="conditionId" onChange={handleChange} required value={formData.conditionId} className="selects">
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
            <select name="stateId" onChange={handleChange} required value={formData.stateId} className="selects">
              <option value="">Seleccionar estado</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.description}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Bodega:</label>
            <select name="storeId" onChange={handleChange} required value={formData.storeId} className="selects">
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
            <select name="ownerId" onChange={handleChange} required value={formData.ownerId} className="selects">
              <option value="">Seleccionar propietario</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Calidad:</label>
            <select name="healthId" onChange={handleChange} required value={formData.healthId} className="selects">
              <option value="">Seleccionar calidad</option>
              {healthStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.description}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Cantidad:</label>
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              required
              value={formData.quantity}
              placeholder="Cantidad"
            />
          </div>

          <div className="formActions">
            <button type="submit">Asignar</button>
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
