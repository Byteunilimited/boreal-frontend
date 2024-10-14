import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import "./AddItemModal.css";

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

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const inventory = {
        id: formData.id,
        description: formData.description,
        inventoryTypeId: Number(formData.inventoryTypeId),
        quantity: Number(formData.stock) || 0,
      };
  
      const options = {
        itemConditionId: Number(formData.itemConditionId),
        stateId: Number(formData.stateId),
        statusId: Number(formData.statusId),
        storeId: Number(formData.storeId),
        ownerId: Number(formData.ownerId),
      };
  
      const payload = {
        inventory,
        options
      };


  console.log(JSON.stringify(payload));
  
      const response = await privateFetch.post("/inventory/item/create", JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue añadido exitosamente.");
        setShowConfirmationModal(true);
        onSave(data);
      } else {
        setError("Ocurrió un error al crear el elemento.");
        setShowConfirmationModal(true);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setError(error.response?.data?.message || "Error al crear el elemento, verifica los datos.");
      setShowConfirmationModal(true);
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
                name="stock"
                onChange={handleChange}
                required
                value={formData.stock || ""}  
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
            <label>Circunstancia:</label>
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
              <option value="">Seleccionar tienda</option>
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
