import { useEffect, useState } from "react";
import { Modal } from "../../../../Layouts";
import { ModalIconCorrect, ModalIconMistake } from "../../../../assets";
import { API_ENDPOINT } from "../../../../util";
import { useAxios } from "../../../../Contexts";
import Select from "react-select";
export const UpdateStore = ({ show, onClose, onUpdate, storeData }) => {
    const { privateFetch } = useAxios();
    const [formData, setFormData] = useState({
        id: storeData?.Código || "",
        description: "",
        phone: "",
        email: "",
        address: "",
        cityId: "",
        officeId: "",
        storeTypeId: "",
    });
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [storeTypes, setStoreTypes] = useState([]);
    const [offices, setOffices] = useState([]);

    useEffect(() => {
        if (show && storeData?.Código) {

            fetchStoreTypes();
            fetchOffices();
            fetchCities();
            fetchStoreData();
        }
    }, [show, storeData]);

    console.log(storeData);

    const fetchStoreData = async () => {
        try {
            const response = await privateFetch.get(`/location/store/item/id?id=${storeData.Código}`);
            if (response.status === 200 && response.data.result.items.length > 0) {
                const store = response.data.result.items[0];
                console.log("Store data:", store);
                setFormData({
                    id: store.id,
                    description: store.description,
                    phone: store.phone,
                    email: store.email,
                    address: store.address,
                    cityId: store.city.id,
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

    const fetchStoreTypes = async () => {
        try {
            const response = await privateFetch.get("/location/store/type/all?page=0&size=100");
            if (response.status === 200) {
                const storeTypes = response.data.result.items || [];
                const options = storeTypes
                    .filter(type => type.id !== 1)  
                    .map((type) => ({
                        value: type.id,
                        label: type.description,
                    }));
    
                setStoreTypes(options);
            }
        } catch (error) {
            console.error("Error fetching store types:", error);
        }
    };
    

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

    const fetchOffices = async () => {
        try {
            const response = await privateFetch.get("/location/office/all?page=0&size=2000");
            if (response.status === 200) {
                const offices = response.data.result.items || [];
                const options = offices.map((office) => ({
                    value: office.id,
                    label:office.description,
                }));
                setOffices(options);
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
    };


    const handleKeyPress = (e) => {
        const regex = /^[a-zA-Z0-9-ÑñÁÉÍÓÚáéíóú\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : null }));
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
                        <Select
                            options={offices}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "officeId")}
                            placeholder="Seleccionar sucursal"
                            value={offices.find(option => option.value === formData.officeId)}
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
                        <label>Tipo de bodega:</label>
                        <Select
                            options={storeTypes}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "storeTypeId")}
                            placeholder="Seleccionar tipos de bodega"
                            value={storeTypes.find(option => option.value === formData.storeTypeId)}
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
