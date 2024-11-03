import React, { useState, useEffect } from "react";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import Select from "react-select";

export const AsignedItemUpdate = ({ show, onClose, item, onSave }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
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
    if (show && item?.Código) {
      fetchItemData();
      fetchFilters();
    }
  }, [show, item]);

  const fetchItemData = async () => {
    try {
      const response = await privateFetch.get(`/inventory/stock/id?id=${item.Código}&page=0&size=1`);
      const itemData = response.data.result.items[0]; 
      setFormData({
        id: itemData.id || "",
        inventoryId: itemData.inventory.id || "",
        conditionId: itemData.condition.id || "",
        stateId: itemData.state.id || "",
        storeId: itemData.store.id || "",
        ownerId: itemData.owner.id || "",
        healthId: itemData.health.id || "",
        quantity: itemData.quantity || "",
      });
    } catch (error) {
      console.error("Error fetching item data:", error);
      setError("Ocurrió un error al obtener los datos del item.");
    }
  };
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

      const conditions = conditionRes.data.result.items || [];
      const optionsConditions = conditions.map((condition) => ({
        value: Number(condition.id),
        label: condition.description,
      }));
      setConditions(optionsConditions);


      const states = stateRes.data.result.items || [];
      const optionsStates = states.map((state) => ({
        value: Number(state.id),
        label: state.description,
      }));
      setStates(optionsStates); 


      const stores = storeRes.data.result.items || [];
      const optionsStores = stores.map((store) => ({
        value: Number(store.id),
        label: `${store.description} - ${store.storeType.description}`,
      }));
      setStores(optionsStores);


      const owners = ownerRes.data.result.items || [];
      const optionsOwners = owners.map((owner) => ({
        value: Number(owner.id),
        label: owner.name,
      }));
      setOwners(optionsOwners);
      
      const healthStatuses = healthRes.data.result.items || [];
      const optionsHealthStatuses = healthStatuses.map((healthStatus) => ({
        value: Number(healthStatus.id),
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption ? Number(selectedOption.value) : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await privateFetch.put("/inventory/stock/update", { id: formData.id, ...formData });

      if (response && response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El stock fue actualizado exitosamente.");
        setTimeout(() => {
          setShowConfirmationModal(false);
          onClose();
        }, 3000);
      } else {
        setError(`Hubo un problema. Código de respuesta: ${response?.status || "Desconocido"}`);
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
  };

  return (
    <div className={`modalOverlay ${show ? "visible" : ""}`}>
      <div className="modalContent">
        <h2>Editar Stock</h2>
        <form onSubmit={handleSubmit}>
        <div className="formGroup">
            <label>Elemento:</label>
            <Select
              options={inventoryItems}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "inventoryId")}
              placeholder="Seleccionar elemento"
              value={inventoryItems.find(option => option.value === formData.inventoryId)}
              isClearable
              isDisabled
              className="selects"
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
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
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
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
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
            />
          </div>

          <div className="formGroup">
            <label>Bodega:</label>
            <Select
              options={stores}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "storeId")}
              placeholder="Seleccionar bodega"
              value={stores.find(option => option.value === formData.storeId)}
              isClearable
              className="selects"
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
            />
          </div>

          <div className="formGroup">
            <label>Propietario:</label>
            <Select
              options={owners}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "ownerId")}
              placeholder="Seleccionar propietario"
              value={owners.find(option => option.value === formData.ownerId)}
              isClearable
              className="selects"
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
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
              styles={{ control: base => ({ ...base, borderRadius: "1em", textAlign: "start" }) }}
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
            <button type="submit">Actualizar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
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
