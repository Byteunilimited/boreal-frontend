import { useEffect, useState } from "react";
import { useAxios } from "../../../Contexts";

export const AddItemModal = ({ show, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    if (show) {
      const localDate = new Date();
      const utcOffset = localDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(localDate.getTime() - utcOffset);
      setFormData((prev) => ({
        ...prev,
        Fecha: adjustedDate.toISOString().substr(0, 10),
      }));
    }
  }, [show]);

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
      const response = await privateFetch.post("/inventory/create", formData);
      console.log({ response });
      if (response.status === 200) {
        closeModal();
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue añadido exitosamente.");
        setShowConfirmationModal(true);
        setTimeout(() => {
          setShowConfirmationModal(false);
        }, 3000);
        onSave(response.data);
      }
    } catch (error) {
      console.log(error);
      setIsSuccessful(false);
      if (error.response && error.response.status === 422) {
        setError("El código debe tener al menos 6 caracteres.");
      } else if (error.response && error.response.status === 409) {
        setError("El código ya existe.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
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
            />
          </div>
          <div className="formGroup">
            <label>Estado:</label>
            <select
              name="isEnable"
              onChange={handleChange}
              required
              className="select"
            >
              <option value="">Seleccionar estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Cantidad:</label>
            <input
              placeholder="Cantidad existente"
              type="number"
              name="stock"
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Tipo:</label>
            <select
              name="inventoryTypeId"
              onChange={handleChange}
              required
              className="select"
            >
              <option value="">Seleccionar tipo</option>
              <option value="1">Repuesto</option>
              <option value="2">Producto</option>
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
