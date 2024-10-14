import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { useAxios } from "../../../../Contexts";
import { API_ENDPOINT } from "../../../../util";

export const UpdateOwner = ({ show, onClose, ownerData, onUpdate }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: ownerData.id,
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
        if (show && ownerData?.id) {
            fetchCities();
            fetchStoreData();
        }
    }, [show, ownerData]);
console.log(ownerData);


    const fetchStoreData = async () => {
        try {
            const response = await privateFetch.get(`/location/owner/id?id=${ownerData.id}`);
            if (response.status === 200 && response.data.result.zone.length > 0) {
                const owner = response.data.result.zone[0];
                setFormData({
                    id: owner.id,
                    nit: owner.nit,
                    businessName: owner.businessName,
                    phone: owner.phone,
                    email: owner.email,
                    address: owner.address,
                    cityId: owner.city.id
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
            const response = await privateFetch.get("/location/city/all");
            if (response.status === 200) {
                setCities(response.data.result.city);
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
            } else if (response.status === 422) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y el NIT debe tener al menos 3 caracteres.");
                setShowConfirmationModal(true);
            } else if (response.status === 409) {
                setIsSuccessful(false);
                setError("El Nombre del negocio y el NIT ya existen. Por favor, elija otro.");
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
        onClose(); 
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
