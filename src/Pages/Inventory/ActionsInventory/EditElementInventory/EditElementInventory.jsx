import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./EditElementInventory.css";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { API_ENDPOINT } from "../../../../util";

export const EditElementInventory = ({ show, item, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchItemData = async () => {
      if (item && item.Código) {
        try {
          const apiUrl = `${API_ENDPOINT}/inventory/item/find`;
          const payload = { inventoryId: item.Código };
          const response = await axios.post(apiUrl, payload);

          if (response.data && response.data.result && response.data.result.inventory.length > 0) {
            const productData = response.data.result.inventory[0];

            setFormData({
              id: productData.id || "",
              description: productData.inventory.description || "",
              isEnable: productData.state.id || "", 
              stock: productData.quantity || 0,
              owner: productData.owner.id || "", 
              office: productData.store.id || "", 
              condition: productData.itemCondition.id || "", 
              status: productData.status.id || "", 
              type: productData.inventory.inventoryType.id || "", 
            });
          } else {
            setError("No se encontraron datos del producto.");
          }
        } catch (error) {
          console.log("Error fetching item data:", error);
          setError("Error al cargar los datos del producto.");
        }
      }
    };

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

    if (show) {
      fetchItemData();
      fetchFilters();
    }
  }, [item, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const apiUrl = `${API_ENDPOINT}/inventory/item/update`;
      const response = await axios.put(apiUrl, formData);
      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue actualizado exitosamente.");
        setShowConfirmationModal(true);
        onSave(formData);
      } else {
        console.log("Ocurrió un error inesperado.");
      }
    } catch (error) {
      console.log(error);
      setIsSuccessful(false);
      setError("Ocurrió un error en el servidor, intente nuevamente.");
      setShowConfirmationModal(true);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Editar Elemento</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Código:</label>
            <input type="text" name="id" value={formData.id || ""} disabled />
          </div>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Estado:</label>
            <select
              name="isEnable"
              value={formData.isEnable || ""}
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar estado</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Tipo:</label>
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar tipo</option>
              {inventoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Condición:</label>
            <select
              name="condition"
              value={formData.condition || ""}
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar condición</option>
              {conditions.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.description}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Estado del artículo:</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar estado del artículo</option>
              {statuses.map((status) => (
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
              name="stock"
              value={formData.stock || 0}
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
  );
};

EditElementInventory.propTypes = {
  show: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
