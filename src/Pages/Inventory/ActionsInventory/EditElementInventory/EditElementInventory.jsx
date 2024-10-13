import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./EditElementInventory.css";
import { useAxios } from "../../../../Contexts";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../Assets";
import { API_ENDPOINT } from "../../../../Util";

export const EditElementInventory = ({ show, item, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [isStockEditable, setIsStockEditable] = useState(true);
  const [showStockInput, setShowStockInput] = useState(true);

  useEffect(() => {
    console.log("Item recibido:", item);
    if (item) {
      const inventoryTypeId = item.Tipo === "Producto" ? 2 : 1;
      const officeId = item.Sucursal ? findOfficeIdByName(item.Sucursal) : "";

      setFormData({
        id: item.Código || "",
        description: item.Nombre || "",
        isEnable: item.Estado === "Activo",
        stock: item.Existencias || 0,
        inventoryTypeId: inventoryTypeId,
        // officeId: officeId,
      });
      if (item.Tipo === "Producto") {
        setShowStockInput(false); 
      } else {
        setShowStockInput(true);
      }

      // fetchOffices();
    }
  }, [item]);
  
  // const findOfficeIdByName = (name) => {
  //   const office = offices.find((office) => office.description === name);
  //   return office ? office.id : "";
  // };

  // const fetchOffices = async () => {
  //   try {
  //     const response = await privateFetch.get("/office/all");
  //     if (response.status === 200) {
  //       setOffices(response.data.result.office);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setError("Ocurrió un error al obtener las oficinas.");
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inventoryTypeId") {
      if (value === "2") {
        setFormData((prev) => ({ ...prev, stock: 0 }));
        setIsStockEditable(false);
        setShowStockInput(false); // Ocultar el campo de cantidad
      } else {
        setIsStockEditable(true);
        setShowStockInput(true); // Mostrar el campo de cantidad
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleOfficeChange = (e) => {
  //   setSelectedOffice(e.target.value);
  //   setFormData((prev) => ({ ...prev, officeId: e.target.value }));
  // };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const apiUrl =
        `${API_ENDPOINT}/inventory/item/update`;
      const response = await axios.put(apiUrl, {
        ...formData,
        isEnable: formData.isEnable, 
        inventoryTypeId: Number(formData.inventoryTypeId),
        // officeId: Number(formData.officeId),
      });
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
      setError("Ocurrió un error inesperado.");
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
            <input type="text" name="id" value={formData.id || ""} disabled/>
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
              value={formData.isEnable}
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="formGroup">
            <label>Tipo:</label>
            <select
              name="inventoryTypeId"
              value={formData.inventoryTypeId || ""}
              disabled
              onChange={handleChange}
              required
              className="selects"
            >
              <option value="">Seleccionar tipo</option>
              <option value="1">Repuesto</option>
              <option value="2">Producto</option>
            </select>
          </div>

           {showStockInput && (
            <div className="formGroup">
              <label>Cantidad:</label>
              <input
                placeholder="Cantidad existente"
                type="number"
                name="stock"
                onChange={handleChange}
                required
                value={formData.stock || ""}
                readOnly={!isStockEditable}
              />
            </div>
          )}
          {/* <div className="formGroup">
            <label>Sucursal:</label>
            <select
              value={formData.officeId}
              name="officeId"
              onChange={handleOfficeChange}
              required
              className="selects"
            >
              <option value="">Seleccionar sucursal</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.description}
                </option>
              ))}
            </select>
          </div> */}
          <div className="formActions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
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
