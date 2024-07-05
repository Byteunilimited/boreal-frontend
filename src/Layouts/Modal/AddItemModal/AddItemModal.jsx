import { useEffect, useState } from "react";
import { useAxios } from "../../../Contexts";
import { Modal } from "../BaseModal";
import { ModalIconCorrect, ModalIconMistake } from "../../../assets";
import "./AddItemModal.css";

export const AddItemModal = ({ show, onClose, onSave }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");

  useEffect(() => {
    if (show) {
      const localDate = new Date();
      const utcOffset = localDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(localDate.getTime() - utcOffset);
      setFormData((prev) => ({
        ...prev,
        Fecha: adjustedDate.toISOString().substr(0, 10),
      }));

      fetchOffices();
    }
  }, [show]);

  const fetchOffices = async () => {
    try {
      const response = await privateFetch.get("/office/all");
      if (response.status === 200) {
        setOffices(response.data.result.office);
      }
    } catch (error) {
      console.log(error);
      setError("Ocurrió un error al obtener las oficinas.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field: ${name}, Value: ${value}`)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
    setFormData((prev) => ({ ...prev, officeId: e.target.value }));
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const requestData = {
        ...formData,
        stock: Number(formData.stock),
      };
      console.log('Request Data:', requestData);
      const response = await privateFetch.post("/inventory/item/create", requestData);
      console.log({ response });
      if (response.status === 200) {
        setIsSuccessful(true);
        setConfirmationMessage("El elemento fue añadido exitosamente.");
        setShowConfirmationModal(true);
        onSave(response.data);
        onClose(); // Cerrar el modal de creación
      }
    } catch (error) {
      console.log(error);
      setIsSuccessful(false);
      if (error.response) {
        switch (response.status) {
          case 422:
            setError("El código debe tener al menos 6 caracteres.");
            break;
          case 409:
            setError("El código ya existe.");
            break;
          default:
            setError("Ocurrió un error inesperado.");
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
      setShowConfirmationModal(true);
      setTimeout(() => {
        setShowConfirmationModal(false);
        setTimeout(() => {
          onClose(false); // Reabrir el modal de creación después de 5 segundos
        }, 0);
      }, 5000);
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
              className="selects"
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
              className="selects"
            >
              <option value="">Seleccionar tipo</option>
              <option value="1">Repuesto</option>
              <option value="2">Producto</option>
            </select>
          </div>
          <div className="formGroup">
            <label>Sucursal:</label>
            <select
              name="officeId"
              value={selectedOffice}
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
