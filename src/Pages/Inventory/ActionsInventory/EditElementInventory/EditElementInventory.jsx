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

  useEffect(() => {
    const fetchItemData = async () => {
      if (item && item.Código) {
        try {
          const apiUrl = `${API_ENDPOINT}/inventory/item/find?search=${item.Código}`;
          const response = await axios.get(apiUrl);

          if (response.data && response.data.result && response.data.result.items.length > 0) {
            const productData = response.data.result.items[0];

            setFormData({
              id: productData.id || "",
              description: productData.description || "",
              inventoryTypeId: productData.inventoryType.id || "", 
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
        const typeRes = await privateFetch.get("/inventory/type/all");
        setInventoryTypes(typeRes.data.result.items || []);
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
      const payload = {
        id: formData.id,
        description: formData.description,
        inventoryTypeId: formData.inventoryTypeId,
      };
      const response = await axios.put(apiUrl, payload);
      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue actualizado exitosamente.");
        setShowConfirmationModal(true);
        onSave(payload);
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
            <label>Tipo:</label>
            <select
              name="inventoryTypeId"
              value={formData.inventoryTypeId || ""}
              onChange={handleChange}
              required
              className="selects"
              disabled 
            >
              <option value="">Seleccionar tipo</option>
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
