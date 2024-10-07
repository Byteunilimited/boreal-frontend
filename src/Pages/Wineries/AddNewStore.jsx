import { useEffect, useState } from "react";
import "./AddStoreModal.css";
import { Modal } from "../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../assets";
import { API_ENDPOINT } from "../../util";
import { useAxios } from "../../Contexts";


export const AddNewStoreModal = ({ show, onClose, onSave }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        description: "",
        phone: "",
        email: "",
        address: "",
        cityId: "",
        ownerId: "",
        officeId: "",
        storeTypeId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [owners, setOwners] = useState([]);
    const [storeTypes, setStoreTypes] = useState([]);
    const [offices, setOffices] = useState([]);

    // Fetch owners, store types, and offices on mount
    useEffect(() => {
        if (show) {
            fetchOwners();
            fetchStoreTypes();
            fetchOffices();
        }
    }, [show]);

    const fetchOwners = async () => {
        try {
            const response = await privateFetch.get("/location/owner/all");
            if (response.status === 200) {
                setOwners(response.data.result.zone);
            }
        } catch (error) {
            console.error("Error fetching owners:", error);

        }
    };

    const fetchStoreTypes = async () => {
        try {
            const response = await privateFetch.get("/location/store/type/all");
            if (response.status === 200) {
                setStoreTypes(response.data.result.item);
            }
        } catch (error) {
            console.error("Error fetching store types:", error);

        }
    };

    const fetchOffices = async () => {
        try {
            const response = await privateFetch.get("/location/office/all");
            if (response.status === 200) {
                setOffices(response.data.result.entity);
            }
        } catch (error) {
            console.error("Error fetching offices:", error);
            /**
             * Fetches the offices from the API
             */
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handles changes to the form data
     * @param {SyntheticEvent} e - The event
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const response = await privateFetch.post("/location/store/item/create", formData);
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("La bodega fue añadida exitosamente.");
                /**
                 * Handles the form submission
                 * @param {SyntheticEvent} ev - The event
                 */
                setShowConfirmationModal(true);
                onSave(data);
            } else {
                throw new Error("Error en la creación de la bodega.");
            }
        } catch (error) {
            console.error("Error creando la bodega:", error);
            setError("Ocurrió un error inesperado.");
            setShowConfirmationModal(true);
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Añadir Nueva Bodega</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nombre de la bodega"
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
                            placeholder="Telefón de la bodega"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email de la bodega"
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
                            placeholder="Dirección de la bodega"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label>Sucursal:</label>
                        <select name="officeId" value={formData.officeId} onChange={handleChange} required className="selects" placeholder="Sucursal">
                            <option value="">Seleccionar sucursal</option>
                            {offices && offices.length > 0 ? (
                                offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.description}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Cargando sucursales...</option>
                            )}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label>Propietario:</label>
                        <select name="ownerId" value={formData.ownerId} onChange={handleChange} required className="selects" placeholder="Propietario">
                            <option value="">Seleccionar propietario</option>
                            {owners && owners.length > 0 ? (
                                owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.businessName}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Cargando propietarios...</option>
                            )}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label>Tipo de Bodega:</label>
                        <select name="storeTypeId" value={formData.storeTypeId} onChange={handleChange} required className="selects" placeholder="Tipo de bodega">
                            <option value=""> Seleccionar tipo</option>
                            {storeTypes && storeTypes.length > 0 ? (
                                storeTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.description}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Cargando tipos de bodega...</option>
                            )}
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
                    onClose={() => setShowConfirmationModal(false)}
                    showCloseButton
                />
            )}
        </div>
    );
};
