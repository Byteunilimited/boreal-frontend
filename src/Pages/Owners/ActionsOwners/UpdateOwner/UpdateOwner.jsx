import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { useAxios } from "../../../../Contexts";
import { API_ENDPOINT } from "../../../../util";
import Select from "react-select";
export const UpdateOwner = ({ show, onClose, ownerData, onUpdate }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: ownerData.id,
        nit: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        cityId: "",
        //stateId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        if (show && ownerData?.id) {
            fetchCities();
            fetchStoreData();
        }
    }, [show, ownerData]);

    const fetchStoreData = async () => {
        try {
            const response = await privateFetch.get(`/location/owner/id?id=${ownerData.id}`);
            if (response.status === 200 && response.data.result.items.length > 0) {
                const owner = response.data.result.items[0];
                setFormData({
                    id: owner.id,
                    nit: owner.nit,
                    name: owner.name,
                    phone: owner.phone,
                    email: owner.email,
                    address: owner.address,
                    cityId: owner.city.id,
                    //stateId: owner.stateId,

                });
            } else {
                setError("No se encontraron datos para la bodega.");
            }
        } catch (error) {
            console.error("Error fetching store data:", error);
            setError("Ocurrió un error al obtener los datos de la bodega.");
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
            const response = await privateFetch.put(
                `${API_ENDPOINT}/location/owner/update`,
                formData
            );
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("El dueño fue actualizado exitosamente.");
                setShowConfirmationModal(true);
                onUpdate(data); 
                setTimeout(() => {
                    setShowConfirmationModal(false);
                    onClose();
                }, 3000);
            } else if (response.status === 422) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y el NIT debe tener al menos 3 caracteres.");
                setShowConfirmationModal(true);
            } else if (response.status === 409) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y/o el NIT ya existen. Por favor, elija otro.");
                setShowConfirmationModal(true);
            } else {
                throw new Error("Error en la actualización del dueño.");
            }
        } catch (error) {
            console.error("Error actualizando el dueño:", error);
            setIsSuccessful(false);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };

    const closeModal = () => {
        setShowConfirmationModal(false); 
        setError(null); 
        setConfirmationMessage(""); 
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : null }));
    };
    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Actualizar Propietario</h2>
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
                    {/* <div className="formGroup">
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
                                    {`${state.description} (${state.department.description})`}
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
