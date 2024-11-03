import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { useAxios } from "../../../../Contexts";
import { Eye, EyeOff } from "react-feather";
import { API_ENDPOINT } from "../../../../util";
import Select from "react-select";
export const AddNewOwner = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        name: "",
        nit: "",
        address: "",
        phone: "",
        email: "",
        cityId: "",
        stateId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        if (show) {
            fetchCities();
            //fetchStates();
        }
    }, [show]);

    const fetchCities = async () => {
        try {
            const response = await privateFetch.get("/location/city/all?page=0&size=1119");
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

    /*const fetchStates = async () => {
        try {
            const response = await privateFetch.get("/lifecycle/state/all?page=0&size=2000");
            if (response.status === 200) {
                setStates(response.data.result.items);
            }
        } catch (error) {
            setError("Ocurrió un error al obtener las ciudades.");
        }
    };*/
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
    
            const response = await fetch(`${API_ENDPOINT}/location/owner/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData), 
            });
    
            if (response.ok) {
                const data = await response.json();
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
    const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : null }));
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
                            name="name"
                            value={formData.name}
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
                   {/*  <div className="formGroup">
                        <label>Estado:</label>
                        <select
                            name="stateId"
                            value={formData.stateId}
                            onChange={handleChange}
                            required
                            className="selects"
                        >
                            <option value="">Seleccionar estado</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {`${state.description}`}
                                </option>
                            ))}
                        </select>
                    </div> */}
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
