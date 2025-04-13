import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import Select from "react-select";

export const AsignedItemModal = ({ show, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    inventoryId: "",
    conditionId: "",
    storeId: "",
    ownerId: "",
    healthId: "",
    quantity: "",
    stateId: "",
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
  const [data, setData] = useState([]);

  useEffect(() => {
    if (show) {
      fetchFilters();
    }
  }, [show]);
  const fetchFilters = async () => {
    try {
      const [inventoryRes, conditionRes, stateRes, storeRes, ownerRes, healthRes] = await Promise.all([
        privateFetch.get("/inventory/item/all?page=0&size=2000"),
        privateFetch.get("/lifecycle/condition/all?page=0&size=2000"),
        privateFetch.get("/lifecycle/state/all?page=0&size=2000"),
        privateFetch.get("/location/store/item/all?page=0&size=2000"),
        privateFetch.get("/location/owner/all?page=0&size=2000"),
        privateFetch.get("/lifecycle/health/all?page=0&size=2000"),
      ]);
  
      const inventories = inventoryRes.data.result.items || [];
      const filteredInventories = inventories.filter(inventory => inventory.inventoryType.id !== 2);
      const optionItemsInventory = filteredInventories.map((inventory) => ({
        value: inventory.id,
        label: `${inventory.id} - ${inventory.description}`
      }));
      setInventoryItems(optionItemsInventory);
  
      // Conditions
      const conditions = conditionRes.data.result.items || [];
      const optionsConditions = conditions.map((condition) => ({
        value: condition.id,
        label: condition.description,
      }));
      setConditions(optionsConditions);
  
      // States
      const states = stateRes.data.result.items || [];
      const optionsStates = states.map((state) => ({
        value: state.id,
        label: state.description,
      }));
      setStates(optionsStates);
  
      // Stores (filtering out stores with storeType.id === 1)
      const stores = storeRes.data.result.items || [];
      const filteredStores = stores.filter(store => store.storeType.id !== 1 && store.storeType.id !== 3);
      const optionsStores = filteredStores.map((store) => ({
        value: store.id,
        label: `${store.description} - ${store.storeType.description}`,
      }));
      setStores(optionsStores);
  
      // Owners
      const owners = ownerRes.data.result.items || [];
      const optionsOwners = owners.map((owner) => ({
        value: owner.id,
        label: owner.name,
      }));
      setOwners(optionsOwners);
  
      // Health Statuses
      const healthStatuses = healthRes.data.result.items || [];
      const optionsHealthStatuses = healthStatuses.map((healthStatus) => ({
        value: healthStatus.id,
        label: healthStatus.description,
      }));
      setHealthStatuses(optionsHealthStatuses);
  
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
      const response = await privateFetch.post("/inventory/stock/assign", formData);
      console.log('Datos a enviar:', formData);

      if (response && response.status === 200) {
        const data = response.data.result.items[0];
        setIsSuccessful(true);
        setConfirmationMessage("El stock fue asignado exitosamente.");
        setData(data);
        setTimeout(() => {
          setShowConfirmationModal(false);
          onClose();

        }, 1000);
      } else {
        setError(`Hubo un problema. Código de respuesta: ${response?.status || "Desconocido"}`);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError("Error de red: Verifica tu conexión o intenta nuevamente más tarde.");
      } else {
        console.error("Error inesperado:", error);
        setError("Ocurrió un error inesperado. Detalles: " + error.message);
      }
    }
    
    setShowConfirmationModal(true);
  };
  
  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onSave(data);
  };
const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({
        ...prev,
        [field]: selectedOption
            ? 
              ["conditionId", "healthId", "storeId", "ownerId", "stateId", "quantity"].includes(field)
                ? Number(selectedOption.value)
                : selectedOption.value
            : null
    }));
};


  return (
    <div className={`modalOverlay ${show ? "visible" : ""}`}>
      <div className="modalContent">
        <h2>Asignar Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Elemento:</label>
            <Select
              options={inventoryItems}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "inventoryId")}
              placeholder="Seleccionar elemento"
              value={inventoryItems.find(option => option.value === formData.inventoryId)}
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

          <div className="formGroup">
            <label>Condición:</label>
            <Select
              options={conditions}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "conditionId")}
              placeholder="Seleccionar condición"
              value={conditions.find(option => option.value === formData.conditionId)}
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

           <div className="formGroup">
            <label>Estado:</label>
            <Select
              options={states}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "stateId")}
              placeholder="Seleccionar estado"
              value={states.find(option => option.value === formData.stateId)}
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

          <div className="formGroup">
            <label>Bodega:</label>
            <Select
              options={stores}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "storeId")}
              placeholder="Seleccionar elemento"
              value={stores.find(option => option.value === formData.storeId)}
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

          <div className="formGroup">
            <label>Propietario:</label>
            <Select
              options={owners}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "ownerId")}
              placeholder="Seleccionar elemento"
              value={owners.find(option => option.value === formData.ownerId)}
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

          <div className="formGroup">
            <label>Calidad:</label>
            <Select
              options={healthStatuses}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "healthId")}
              placeholder="Seleccionar calidad"
              value={healthStatuses.find(option => option.value === formData.healthId)}
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
