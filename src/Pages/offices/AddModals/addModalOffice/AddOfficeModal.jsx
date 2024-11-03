import { useEffect, useState } from "react";
import { useAxios } from "../../../../Contexts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { API_ENDPOINT } from "../../../../util";
import { Modal } from "../../../../Layouts";
import Select from "react-select";
export const AddOfficeModal = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        description: "",
        phone: "",
        address: "",
        email: "",
        ownerId: "",
        roleId: "",
        cityId: "",
        //stateId: "",
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [owners, setOwners] = useState([]);
    const [cities, setCities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [states, setStates] = useState([]);


    useEffect(() => {
        if (show) {
            fetchOwners();
            fetchCities();
           // fetchStates();
        }
    }, [show]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : null }));
    };
    const handleKeyPress = (e) => {
        const regex = /^[a-zA-Z0-9-ÑñÁÉÍÓÚáéíóú\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };
    
    const validateForm = () => {
        // Check if all required fields are filled
        return formData.description && formData.phone && formData.email && formData.address && formData.ownerId && formData.cityId;
    };

    const fetchOwners = async () => {
        try {
            const response = await privateFetch.get("/location/owner/all?page=0&size=2000");
            if (response.status === 200) {
                const owners = response.data.result.items || [];
                const options = owners.map((owner) => ({
                    value: owner.id,
                    label: owner.name
                }));
                setOwners(options);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener los propietarios.");
        }
    };

    const fetchCities = async () => {
        try {
            const response = await privateFetch.get("/location/city/all?page=0&size=2000");
            if (response.status === 200) {
                const cities = response.data.result.items || [];
                const options = cities.map((city) => ({
                    value: city.id,
                    label:`${city.description}, - ${city.department.description}`,
                }));
                setCities(options);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };

    /* const fetchStates = async () => {
        try {
            const response = await privateFetch.get("/lifecycle/state/all?page=0&size=2000");
            if (response.status === 200) {
                const states = response.data.result.items || [];
                const options = states.map((state) => ({
                    value: state.id,
                    label: state.description,
                }));
                setStates(options);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las ciudades.");
        }
    }; */

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

            const response = await fetch(`${API_ENDPOINT}/location/office/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                setIsSuccessful(true);
                setConfirmationMessage("La sucursal fue añadida exitosamente.");
                setShowConfirmationModal(true);
                onSave(data);
            } else if (response.status === 422) {
                setError("Verifica la información proporcionada.");
                setShowConfirmationModal(true);
            } else if (response.status === 409) {
                setError("Verifica la información, ya existen sucursales con estos datos");
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
                <h2>Añadir Nueva Sucursal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input
                            placeholder="Nombre sucursal"
                            type="text"
                            name="description"
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
                            onChange={handleChange}
                            required
                            maxLength="70"
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
                        <label>Ciudad:</label>
                        <Select
                            options={cities}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "cityId")}
                            placeholder="Seleccionar ciudad"
                            value={cities.find(option => option.value === formData.cityId)}
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

                    {/* <div className="formGroup">
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
                    </div> */}

                    <div className="formActions">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar"}
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
