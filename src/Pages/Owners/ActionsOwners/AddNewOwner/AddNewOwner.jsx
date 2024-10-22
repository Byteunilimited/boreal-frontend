import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { useAxios } from "../../../../Contexts";
import { Eye, EyeOff } from "react-feather";
import { API_ENDPOINT } from "../../../../util";

export const AddNewOwner = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        businessName: "",
        nit: "",
        address: "",
        phone: "",
        email: "",
        cityId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (show) {
            fetchCities();
        }
    }, [show]);

    const fetchCities = async () => {
        try {
            const response = await privateFetch.get("/location/city/all");
            if (response.status === 200) {
                setCities(response.data.result.items);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            // Convertir el formulario a JSON
            const requestData = { ...formData };
    
            // Realizar la solicitud POST
            const response = await fetch(`${API_ENDPOINT}/location/owner/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData), // Convertir a JSON
            });
    
            if (response.ok) {
                const data = await response.json(); // Parsear el JSON de la respuesta
                setIsSuccessful(true);
                setConfirmationMessage("El dueño fue añadido exitosamente.");
                setShowConfirmationModal(true);
                onSave(data); // Notificar el éxito
            } else if (response.status === 422) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y el NIT deben tener al menos 3 caracteres.");
                setShowConfirmationModal(true);
            } else if (response.status === 409) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y/o el NIT ya existen. Por favor, elija otro.");
                setShowConfirmationModal(true);
            } else {
                throw new Error("Error en la creación del dueño.");
            }
        } catch (error) {
            console.error("Error creando el dueño:", error);
            setIsSuccessful(false);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };
    


    const closeModal = () => {
        setShowConfirmationModal(false);
        setError(null);
        onClose();
    };


    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Añadir Nuevo Propietario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre del Negocio:</label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Nombre del negocio"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>NIT:</label>
                        <input
                            type="text"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            placeholder="NIT del negocio"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Teléfono del negocio"
                            required
                            onKeyPress={(e) => {
                                const regex = /^[0-9]*$/;
                                if (!regex.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            maxLength="10"
                        />
                    </div>
                    <div className="formGroup">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email del negocio"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Dirección del negocio"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Ciudad:</label>
                        <select
                            name="cityId"
                            value={formData.cityId}
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
                    modalIcon={isSuccessful ? ModalIconCorrect : ModalIconMistake}
                    onClose={closeModal}
                    showCloseButton
                />
            )}

        </div>
    );
};
