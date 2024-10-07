import { useEffect, useState } from "react";
import { useAxios } from "../../../Contexts";
import { ModalIconCorrect, ModalIconMistake } from "../../../assets";
import { API_ENDPOINT } from "../../../util";
import { Modal } from "../../../Layouts";

export const UpdateOfficeModal = ({ show, onClose, onUpdate, officeData }) => {
  const { privateFetch } = useAxios();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [owners, setOwners] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && officeData) {
      fetchOwners();
      fetchCities();
      setFormData(officeData); 
    }
  }, [show, officeData]);
  
console.log(officeData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    return (
      formData.description &&
      formData.phone &&
      formData.email &&
      formData.address &&
      formData.ownerId &&
      formData.cityId
      
    );
  };

  

  const fetchOwners = async () => {
    try {
      const response = await privateFetch.get("/location/owner/all");
      if (response.status === 200) {
        setOwners(response.data.result.zone);
      }
    } catch (error) {
      setError("Ocurrió un error al obtener los propietarios.");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await privateFetch.get("/location/city/all");
      if (response.status === 200) {
        setCities(response.data.result.city);
      }
    } catch (error) {
      setError("Ocurrió un error al obtener las ciudades.");
    }
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) {
      setError("Por favor completa todos los campos requeridos.");
      setShowConfirmationModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = { ...formData };

      const response = await fetch(`${API_ENDPOINT}/location/office/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccessful(true);
        setConfirmationMessage("La oficina fue actualizada exitosamente.");
        setShowConfirmationModal(true);
        onUpdate(data);
      } else if (response.status === 422) {
        setError("Verifica la información proporcionada.");
        setShowConfirmationModal(true);
      } else if (response.status === 409) {
        setError("Verifica la información proporcionada.");
        setShowConfirmationModal(true);
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Ocurrió un error en el servidor. Por favor, intenta de nuevo.");
      setShowConfirmationModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Actualizar Sucursal</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              placeholder="Nombre oficina"
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              maxLength="40"
            />
          </div>
          <div className="formGroup">
            <label>Teléfono:</label>
            <input
              placeholder="Número de teléfono"
              type="text"
              name="phone"
              value={formData.phone || ""}
              maxLength="10"
              onKeyPress={(e) => {
                const regex = /^[0-9]*$/;
                if (!regex.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Email:</label>
            <input
              placeholder="Correo electrónico"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              maxLength="40"
            />
          </div>
          <div className="formGroup">
            <label>Dirección:</label>
            <input
              placeholder="Dirección"
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
              maxLength="50"
            />
          </div>
          {owners && owners.length > 0 && (
            <div className="formGroup">
              <label>Propietario:</label>
              <select
                name="ownerId"
                value={formData.ownerId || ""}
                onChange={handleChange}
                required
                className="selects"
              >
                <option value="">Seleccionar propietario</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.businessName}
                  </option>
                ))}
              </select>
            </div>
          )}

{cities && cities.length > 0 && (
            <div className="formGroup">
              <label>Ciudad:</label>
              <select
                name="cityId"
                value={formData.cityId || ""}
                onChange={handleChange}
                required
                className="selects"
              >
                <option value="">Seleccionar ciudad</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {`${city.description} (${city.department.description})`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="formActions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar"}
            </button>
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
