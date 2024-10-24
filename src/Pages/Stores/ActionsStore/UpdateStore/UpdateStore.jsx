import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { API_ENDPOINT } from "../../../../util";
import { useAxios } from "../../../../Contexts";

export const UpdateStore = ({ show, onClose, onUpdate, storeData }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: storeData?.Código || "",
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
    const [cities, setCities] = useState([]);
    const [owners, setOwners] = useState([]);
    const [storeTypes, setStoreTypes] = useState([]);
    const [offices, setOffices] = useState([]);

    useEffect(() => {
        if (show && storeData?.Código) {
            fetchOwners();
            fetchStoreTypes();
            fetchOffices();
            fetchCities();
            fetchStoreData();
        }
    }, [show, storeData]);


    const fetchStoreData = async () => {
        try {
            const response = await privateFetch.get(`/location/store/item/id?id=${storeData.Código}`);
            if (response.status === 200 && response.data.result.store.length > 0) {
                const store = response.data.result.store[0];
                setFormData({
                    id: store.id,
                    description: store.description,
                    phone: store.phone,
                    email: store.email,
                    address: store.address,
                    cityId: store.city.id,
                    ownerId: store.owner.id,
                    officeId: store.office.id,
                    storeTypeId: store.storeType.id,
                });
            } else {
                setError("No se encontraron datos para la bodega.");
            }
        } catch (error) {
            console.error("Error fetching store data:", error);
            setError("Ocurrió un error al obtener los datos de la bodega.");
        }
    };

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

    const fetchOffices = async () => {
        try {
            const response = await privateFetch.get("/location/office/all");
            if (response.status === 200) {
                setOffices(response.data.result.entity);
            }
        } catch (error) {
            console.error("Error fetching offices:", error);
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
            const response = await privateFetch.put(`/location/store/item/update`, formData);
            if (response.status === 200) {
                const data = response.data;
                setIsSuccessful(true);
                setConfirmationMessage("La bodega fue actualizada exitosamente.");
                setShowConfirmationModal(true);
                onUpdate(data);
            } else {
                throw new Error("Error en la actualización de la bodega.");
            }
        } catch (error) {
            console.error("Error actualizando la bodega:", error);
            setError("Ocurrió un error en el servidor, por favor, intenta de nuevo.");
            setShowConfirmationModal(true);
        }
    };

    const closeModal = () => {
        setShowConfirmationModal(false);
        setError(null);
        onClose();
    };

    const handleKeyPress = (e) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>Actualizar Bodega</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nombre de la bodega"
                            onKeyPress={handleKeyPress}
                            required
                            maxLength="40"
                        />
                    </div>
                    <div className="formGroup">
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Teléfono de la bodega"
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
                            maxLength="50"
                        />
                    </div>
                    <div className="formGroup">
                        <label>Sucursal:</label>
                        <select name="officeId" value={formData.officeId} onChange={handleChange} required className="selects">
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
                        <select name="ownerId" value={formData.ownerId} onChange={handleChange} required className="selects">
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
                        <select name="storeTypeId" value={formData.storeTypeId} onChange={handleChange} required className="selects">
                            <option value="">Seleccionar tipo</option>
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

                    {cities && cities.length > 0 && (
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
                    )}

                    <div className="formActions">
                        <button type="submit">Actualizar</button>
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
